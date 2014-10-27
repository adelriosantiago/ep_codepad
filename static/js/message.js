exports.handleClientMessage_CUSTOM = function(hook, context) {

    var hint = '';
    var hint_title = '';

    if (context.payload.from == 'jshint') {
        if (context.payload.errors) {

            var status = false;
            var idb = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find('#innerdocbody');

            context.payload.errors.forEach(function(err) {
                if (err) {

                    // brief console error log - presistent in the browser
                    console.info(" !: " + context.payload.padid + ":" + err.line + ":" + err.character + " " + err.reason + "|" + err.evidence);
                    // and on mouse over
                    hint_title += err.line + ":" + err.character + " " + err.reason + '\n';

                    if (!status) {
                        // display the first error on the top hint status bar
                        status = true;
                        hint = "js: " + err.line + ":" + err.character + " " + err.reason;
                    }

                    // a little delay, so the push-reply can refresh the text first
                    setTimeout(function() {
                        div = idb.find("div:nth-child(" + err.line + ")");
                        div.addClass("warn");
                        if (typeof div.attr("title") == "undefined") div.attr("title", err.reason);
                    }, 100);

                    // setTimeout(function() {
                    // clear
                    //  $('iframe[name="ace_outer"]').contents().find('iframe').contents().find('#innerdocbody').find("*").removeClass('warn');
                    //  // and remove the attr title
                    // }, 10000);

                    // more detailed if you wish
                    //console.info(" ! " + padid + ":" + err.line + ":" + err.character + " " + err.reason + " !" + err.scope + "|" + err.evidence + "|" + err.id + "|" + err.code + "|" + err.raw);
                }
            });
        }
    }

    if (context.payload.from == 'fs') {
        if (context.payload.errors) {
            console.log(context.payload.padid + " fs: Error! " + JSON.stringify(context.payload.errors));
            hint += 'File Write failed! ' + JSON.stringify(context.payload.errors);
        }
    }

    if (context.payload.from == 'exec') {
        if (context.payload.errors) {
            console.log(context.payload.padid + " exec: Error! " + JSON.stringify(context.payload.errors));
            hint += 'Push action failed! ' + JSON.stringify(context.payload.errors);
        }
    }

    if (context.payload.from == 'codepad') {
        hint = "OK!";
        $('#status').addClass("ok");

        setTimeout(function() {
            $("#status").html('');
            $("#status").removeClass("ok");
            $("#status").removeClass("error");
        }, 5000);


    } else $('#status').addClass("error");

    if (hint !== '') $('#status').html(hint);
    if (hint_title !== '') $('#status').prop('title', hint_title);
};