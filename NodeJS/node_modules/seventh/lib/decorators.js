/*
	Seventh

	Copyright (c) 2017 - 2018 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



var Promise = require( './seventh.js' ) ;



Promise.promisifyAll = ( nodeAsyncFn , thisBinding ) => {

	if ( thisBinding === undefined ) {
		return function( ... args ) {
			return new Promise( ( resolve , reject ) => {
				nodeAsyncFn.call( this , ... args , ( error , ... cbArgs ) => {
					return error ? reject( error ) : resolve( cbArgs ) ;
				} ) ;
			} ) ;
		} ;
	}

	return ( ... args ) => {
		return new Promise( ( resolve , reject ) => {
			nodeAsyncFn.call( thisBinding , ... args , ( error , ... cbArgs ) => {
				return error ? reject( error ) : resolve( cbArgs ) ;
			} ) ;
		} ) ;
	} ;

} ;



// Same than .promisifyAll() but only return the callback args #1 instead of an array of args from #1 to #n
Promise.promisify = ( nodeAsyncFn , thisBinding ) => {

	if ( thisBinding === undefined ) {
		return function( ... args ) {
			return new Promise( ( resolve , reject ) => {
				nodeAsyncFn.call( this , ... args , ( error , cbArg ) => {
					return error ? reject( error ) : resolve( cbArg ) ;
				} ) ;
			} ) ;
		} ;
	}

	return ( ... args ) => {
		return new Promise( ( resolve , reject ) => {
			nodeAsyncFn.call( thisBinding , ... args , ( error , cbArg ) => {
				return error ? reject( error ) : resolve( cbArg ) ;
			} ) ;
		} ) ;
	} ;

} ;



/*
	Pass a function that will be called every time the decoratee return something.
*/
Promise.returnValueInterceptor = ( interceptor , asyncFn , thisBinding ) => {

	if ( thisBinding === undefined ) {
		return function( ... args ) {
			var returnVal = asyncFn.call( this , ... args ) ;
			interceptor( returnVal ) ;
			return returnVal ;
		} ;
	}

	return ( ... args ) => {
		var returnVal = asyncFn.call( thisBinding , ... args ) ;
		interceptor( returnVal ) ;
		return returnVal ;
	} ;

} ;



/*
	Run only once, return always the same promise.
*/
Promise.once = ( asyncFn , thisBinding ) => {

	var triggered = false ;
	var result ;

	return ( ... args ) => {
		if ( ! triggered ) {
			triggered = true ;
			result = asyncFn.call( thisBinding , ... args ) ;
		}

		return result ;
	} ;
} ;



/*
	It does nothing if the decoratee is still in progress, but return the promise of the action in progress.
*/
Promise.debounce = ( asyncFn , thisBinding ) => {

	var inProgress = null ;

	const outWrapper = () => {
		inProgress = null ;
	} ;

	return ( ... args ) => {
		if ( inProgress ) { return inProgress ; }

		inProgress = asyncFn.call( thisBinding , ... args ) ;
		inProgress.then( outWrapper , outWrapper ) ;
		return inProgress ;
	} ;
} ;



/*
	It does nothing if the decoratee is still in progress.
	Instead, the decoratee is called when finished once and only once, if it was tried one or more time during its progress.
	In case of multiple calls, the arguments of the last call will be used.
	The use case is .update()/.refresh()/.redraw() functions.
*/
Promise.debounceUpdate = ( asyncFn , thisBinding ) => {

	var inProgress = null ;
	var nextUpdateWith = null ;
	var nextUpdatePromise = null ;

	const outWrapper = () => {
		var args , sharedPromise ;

		inProgress = null ;

		if ( nextUpdateWith ) {
			args = nextUpdateWith ;
			nextUpdateWith = null ;
			sharedPromise = nextUpdatePromise ;
			nextUpdatePromise = null ;

			// Call the asyncFn again
			inProgress = asyncFn.call( thisBinding , ... args ) ;

			// Forward the result to the pending promise
			inProgress.then( ( value ) => sharedPromise.resolve( value ) , ( error ) => sharedPromise.reject( error ) ) ;

			// BTW, trigger again the outWrapper
			inProgress.then( outWrapper , outWrapper ) ;

			return inProgress ;
		}
	} ;

	const inWrapper = ( ... args ) => {
		if ( inProgress ) {
			if ( ! nextUpdatePromise ) { nextUpdatePromise = new Promise() ; }
			nextUpdateWith = args ;
			return nextUpdatePromise ;
		}

		inProgress = asyncFn.call( thisBinding , ... args ) ;
		inProgress.then( outWrapper , outWrapper ) ;
		return inProgress ;
	} ;

	return inWrapper ;
} ;



/*
	The decoratee execution does not overlap, multiple calls are serialized.
*/
Promise.serialize = ( asyncFn , thisBinding ) => {

	var lastPromise = new Promise.resolve() ;

	return ( ... args ) => {

		var promise = new Promise() ;

		lastPromise.finally( () => {
			asyncFn.call( thisBinding , ... args )
			.then( ( value ) => promise.resolve( value ) , ( error ) => promise.reject( error ) ) ;
		} ) ;

		lastPromise = promise ;

		return promise ;
	} ;
} ;



Promise.timeout = ( timeout , asyncFn , thisBinding ) => {
	if ( thisBinding === undefined ) {
		return function( ... args ) {
			var promise = asyncFn.call( this , ... args ) ;
			// Careful: not my promise, so cannot retrieve its status
			setTimeout( () => promise.reject( new Error( 'Timeout' ) ) , timeout ) ;
			return promise ;
		} ;
	}

	return ( ... args ) => {
		var promise = asyncFn.call( thisBinding , ... args ) ;
		// Careful: not my promise, so cannot retrieve its status
		setTimeout( () => promise.reject( new Error( 'Timeout' ) ) , timeout ) ;
		return promise ;
	} ;

} ;



// Like .timeout(), but here the timeout value is not passed at creation, but as the first arg of each call
Promise.variableTimeout = ( asyncFn , thisBinding ) => {
	if ( thisBinding === undefined ) {
		return function( timeout , ... args ) {
			var promise = asyncFn.call( this , ... args ) ;
			// Careful: not my promise, so cannot retrieve its status
			setTimeout( () => promise.reject( new Error( 'Timeout' ) ) , timeout ) ;
			return promise ;
		} ;
	}

	return ( timeout , ... args ) => {
		var promise = asyncFn.call( thisBinding , ... args ) ;
		// Careful: not my promise, so cannot retrieve its status
		setTimeout( () => promise.reject( new Error( 'Timeout' ) ) , timeout ) ;
		return promise ;
	} ;

} ;



/*
Promise.retry = ( retryCount , retryTimeout , timeoutMultiplier , asyncFn , thisBinding ) => {

	return ( ... args ) => {

		var lastError ,
			count = retryCount ,
			timeout = retryTimeout ,
			globalPromise = new Promise() ;

		const callAgain = () => {
			if ( count -- < 0 ) {
				globalPromise.reject( lastError ) ;
				return ;
			}

			var promise = asyncFn.call( thisBinding , ... args ) ;

			promise.then(
				//( value ) => globalPromise.resolve( value ) ,
				( value ) => {
					globalPromise.resolve( value ) ;
				} ,
				( error ) => {
					lastError = error ;
					setTimeout( callAgain , timeout ) ;
					timeout *= timeoutMultiplier ;
				}
			) ;
		} ;

		callAgain() ;

		return globalPromise ;
	} ;
} ;



Promise.variableRetry = ( asyncFn , thisBinding ) => {

	return ( retryCount , retryTimeout , timeoutMultiplier , ... args ) => {

		var lastError ,
			count = retryCount ,
			timeout = retryTimeout ,
			globalPromise = new Promise() ;

		const callAgain = () => {
			if ( count -- < 0 ) {
				globalPromise.reject( lastError ) ;
				return ;
			}

			var promise = asyncFn.call( thisBinding , ... args ) ;

			promise.then(
				( value ) => globalPromise.resolve( value ) ,
				( error ) => {
					lastError = error ;
					setTimeout( callAgain , timeout ) ;
					timeout *= timeoutMultiplier ;
				}
			) ;
		} ;

		callAgain() ;

		return globalPromise ;
	} ;
} ;
*/

