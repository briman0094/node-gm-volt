﻿import * as cheerio from "cheerio";
import * as delay from "promise-delay";
import * as query from "./myvolt/query";
import * as web from "./web";

import { ChargeStatus, Credentials } from ".";
import { IRequester } from "./requester";

function newError( type: string, message: string, params ? : any ) {
    let error = new Error( message );
    error.name = type;
    Object.assign( error, params );
    return error;
}

export async function init( requester: IRequester ) {
    web.init( requester );
    await web.get( "/" );
}

export async function login( credentials: Credentials ): Promise < void > {
    let form = {
        user: credentials.username,
        password: credentials.password,
        remember: "on",
        captchaId: credentials.captchaId || "",
        captchaAnswer: credentials.captchaAnswer || "",
        formName: "AccountLoginForm",
        userAction: "validateUserCredentials"
    };

    let sessionCookie = web.getCookie( "JSESSIONID" );
    if ( !sessionCookie ) throw newError( "MissingCookie", "Session cookie does not exist" );

    let result = await web.postFormJsonP( `/web/portal/home;jsessionid=${ sessionCookie }`, form, { qs: query.validateLogin } );

    if ( result.result === "invalid" ) throw newError( "InvalidCredentials", "Invalid credentials" );
    if ( result.result === "showCaptcha" ) throw newError( "Captcha", "Captcha presented...you must log into the website in a browser on this device first", {
        ...result
    } );

    delete form.formName;
    form.userAction = "login";

    await web.postForm( `/web/portal/home;jsessionid=${ sessionCookie }`, form, { qs: query.login } );
}

export async function getChargeStatus(): Promise < ChargeStatus > {
    let sessionCookie = web.getCookie( "JSESSIONID" );
    if ( !sessionCookie ) throw newError( "MissingCookie", "Session cookie does not exist" );

    let form: any = {
        initiate: "false",
        chargeSessionId: sessionCookie
    };

    let $ = await runPostRequest( form, query.firstCharging );

    let doContinue = true;
    let chargeStatus: boolean | ChargeStatus = null;

    while ( doContinue ) {
        chargeStatus = await pollChargeStatus( sessionCookie, chargeStatus === null );

        if ( chargeStatus === false ) {
            await delay( 3000 );
        } else {
            doContinue = false;
        }
    }

    return chargeStatus as ChargeStatus;
}

async function pollChargeStatus( chargingSessionId: string, initial: boolean ): Promise < boolean | ChargeStatus > {
    let form: any = {};

    if ( initial ) form.initiate = "true";

    let $ = await runPostRequest( form, query.polling );

    form = {
        checkstatus: "chargingdata",
        chargingSessionId
    };

    $ = await runPostRequest( form, query.charging );
    let status = $( "status" );

    if ( !status ) throw newError( "StatusError", "Unable to poll charging status" );

    let statusCode = parseInt( status.attr( "value" ) );

    if ( statusCode === 1 || statusCode === 2 || ( statusCode === 0 && status.attr( "connect" ) === "true" ) ) {
        return false;
    } else if ( statusCode === 0 ) {
        return <ChargeStatus > {
            pluggedIn: $( "pluggedIn" ).attr( "value" ) === "plugged",
            evRange: parseInt( $( "estEVRange" ).attr( "value" ) ),
            evUnit: $( "estEVRange" ).attr( "unit" ),
            totalRange: parseInt( $( "estTotRange" ).attr( "value" ) ),
            totalUnit: $( "estTotRange" ).attr( "unit" ),
            chargePercent: parseInt( $( "currCharge" ).attr( "value" ) ),
            estDoneBy: $( "estFullCharge" ).attr( "value" )
        };
    } else if ( statusCode === 3 ) {
        throw newError( "SessionExpired", "Your session is expired. Please log out and back in and try again." );
    } else {
        throw newError( "StatusError", `Unexpected status code: ${ statusCode }` );
    }
}

async function runPostRequest( form: any, qs: any ) {
    let result = await web.postForm( "/web/portal/home", form, { qs } );
    let $ = cheerio.load( result );

    if ( !$ ) throw newError( "StatusError", "Status could not be retrieved" );

    let error = $( "status" ).attr( "error" );

    if ( error ) throw newError( "OnStarError", `OnStar returned error: ${ error }` );

    return $;
}