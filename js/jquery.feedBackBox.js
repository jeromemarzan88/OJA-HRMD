/*
	Copyright (c) 2013 
	Willmer, Jens (http://jwillmer.de)	
	
	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:
	
	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	
	feedBackBox: A small feedback box realized as jQuery Plugin.
	@author: Willmer, Jens
	@url: https://github.com/jwillmer/feedBackBox
	@documentation: https://github.com/jwillmer/feedBackBox/wiki
	@version: 0.0.1
*/
; (function ($) {
    $.fn.extend({
        feedBackBox: function (options) {

            // default options
            this.defaultOptions = {
                title: 'Feedback',
                titleMessage: 'Please feel free to leave us feedback.',
                userName: '',
                isUsernameEnabled: true,
                message: ''
            };

            var settings = $.extend(true, {}, this.defaultOptions, options);

            return this.each(function () {
                var $this = $(this);
                var thisSettings = $.extend({}, settings);

                var diableUsername;
                if (!thisSettings.isUsernameEnabled) {
                    diableUsername = 'disabled="disabled"';
                }

                // add feedback box
                $this.html('<div id="fpi_feedback"><div id="fpi_title" class="rotate"><h2>'
                    + thisSettings.title
                    + '</h2></div><div id="fpi_content"><div id="fpi_header_message">'
                    + thisSettings.titleMessage
                    + '</div><div id="fpi_submit_message"><label id="feedbackLabel" for="message">Message</label><textarea id="feedbackMsg" class="form-control" rows="4" name="message"  placeholder="Feedback..."></textarea></div>'
                    + '<p id="fpi_ajax_msg"></p><div id="fpi_submit_submit"><button type="submit" value="Submit" class="btn btn-default" onclick="feedback()">Send</button>'
					+ '</div></div></div>');



                // submit action
                $this.find('form').submit(function () {


                    // send ajax call
                    if (!haveErrors) {
                        // serialize all input fields
                        var disabled = $(this).find(':input:disabled').removeAttr('disabled');
                        var serialized = $(this).serialize();
                        disabled.attr('disabled', 'disabled');

                        // disable submit button
                        $('#fpi_submit_submit input').attr('disabled', 'disabled');

                    }

                    return false;
                });

                // open and close animation
                var isOpen = false;
                $('#fpi_title').click(function () {
                    if (isOpen) {
                        $('#fpi_feedback').animate({ "width": "+=5px" }, "fast")
                        .animate({ "width": "55px" }, "slow")
                        .animate({ "width": "60px" }, "fast");
                        isOpen = !isOpen;
                    } else {
                        $('#fpi_feedback').animate({ "width": "-=5px" }, "fast")
                        .animate({ "width": "365px" }, "slow")
                        .animate({ "width": "360px" }, "fast");

                        // reset properties
                        $('#fpi_submit_loading').hide();
                        $('#fpi_content form').show()
                        $('#fpi_content form .error').removeClass("error");
                        $('#fpi_submit_submit input').removeAttr('disabled');
                        isOpen = !isOpen;
                    }
                });

            });
        }
    });
})(jQuery);

function feedback()
     {
             if (!document.getElementById("feedbackMsg").value) 
             {
                $("#fpi_ajax_msg").html("Cannot send blank feedback.");
                $('#fpi_ajax_msg').css('display', '');
                $("#fpi_ajax_msg").fadeOut(4000,function() {document.getElementById("fpi_ajax_msg").value=""; });
                return 0;
             }

             var module_name = 'feedback';
             var message_text = document.getElementById("feedbackMsg").value;
             jQuery.ajax({
                    type: "POST",
                    url:"lib/postData/feedback.php",
                    dataType:'html',
                    data:{module:module_name,message:message_text},
                     beforeSend: function()
                    {
                        $("#fpi_ajax_msg").html("Sending..");
                    },
                    success:function(response)
                    {
                        $("#fpi_ajax_msg").html(response);
                        document.getElementById("feedbackMsg").value="";
                    },
                    error:function (xhr, ajaxOptions, thrownError){
                        $("#fpi_ajax_msg").html(response);
                    }
                }); 
                $('#fpi_ajax_msg').css('display', '');
                $("#fpi_ajax_msg").fadeOut(4000,function() {document.getElementById("fpi_ajax_msg").value=""; });

     };