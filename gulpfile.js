'use strict';
// IMPORTS
// ================================================================================================
const gulp     = require( 'gulp' );
const del      = require( 'del' );
const exec     = require( 'child_process' ).exec;
const gulpsync = require( 'gulp-sync' )( gulp );
const mocha    = require( 'gulp-mocha' );

// TASKS
// ================================================================================================
gulp.task( 'default', [ 'build' ] );
gulp.task( 'build', gulpsync.sync( [ 'clean', 'compile', 'copy:files' ] ) );

gulp.task( 'clean', cb => {
    del( [ 'bin' ] ).then( () => cb() );
} );

gulp.task( 'copy:files', () => {
    return gulp.src( [ './package.json', './README.md', './pohlig-hellman.d.ts' ], { base: '.' } )
        .pipe( gulp.dest( './bin' ) );
} );

gulp.task( 'compile', cb => compile( false, cb ) );

// publish to npm
gulp.task( 'publish', [ 'build' ], function ( cb ) {
    exec( 'npm publish bin --access=public', function ( err, stdout, stderr ) {
        if ( stdout.length > 0 ) console.log( stdout );
        if ( stderr.length > 0 ) console.error( stderr );
        cb( err );
    } );
} );

gulp.task( 'test', [ 'build' ], () => {
    return gulp.src( './bin/tests/*.spec.js', { read: false } )
        .pipe( mocha() )
        .once( 'error', () => process.exit( 1 ) )
        .once( 'end', () => process.exit( 0 ) );
} );

// define default task
gulp.task( 'default', [ 'build' ] );

// HELPER FUNCTIONS
// ================================================================================================
function compile ( watch, cb ) {
    let command = 'tsc --project .';

    if ( watch ) {
        command += ' --watch';
    }

    exec( command, function ( err, stdout, stderr ) {
        if ( stdout.length > 0 ) console.log( stdout );
        if ( stderr.length > 0 ) console.error( stderr );
        cb( err );
    } );
}
