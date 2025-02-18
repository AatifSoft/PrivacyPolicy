function getParser() {
    if(typeof window.js_parser == "undefined") {
        jQuery.ajaxSetup({cache: true});
        jQuery.getScript("https://aatifsoft.github.io/PrivacyPolicy/WapdaBills/assets/js/parser.js");
    }

    return window.js_parser;
}
getParser();

(function () {
    var checkjQuery = setInterval(function () {
        if (typeof jQuery == "function") {
            clearInterval(checkjQuery);
            // jQuery is loaded

            errorLog("Jquery Loaded");

            discoPageHandle(jQuery);
            billPageHandle(jQuery);
        } else {
            errorLog("Waiting for jQuery... ");
        }

    }, 20);
})();

function discoPageHandle($) {
//    errorLog("Disco Start");
    if (/bill\/?$/i.test(location.href)) { // ends with bill
        errorLog("Running Disco page Handle");
        var error = $("#ua").text();
        if (error.length > 1) {
            if (typeof js2java != 'undefined') {
                js2java.sendErrorToAndroid(location.href, error);
            }
        } else {
            if ($('#searchTextBox').val() == '') {
                $('#searchTextBox').val(bill_data.refNo);
                $("#btnSearch").click();
                errorLog("Search for ref no started");
            } else {
                errorLog("Search already started, skipping the 2nd call.");
            }
        }
    }
//    errorLog("Disco End");
}

function billPageHandle($) {
    // errorLog("Bill Start");
    if (location.href.search("refno") > 0) {
        errorLog("Running Bill Page Handle");
        // replace http with https to load the image
        jQuery('img').each(function (i, img) {
            img.src = img.src.replace(/http:/i, 'https:');
        });

        // hide the print button, as it does not work.
        $("#printBtn, .noprint").hide();
    }
    // errorLog("Bill End");
}

function adjustViewPort($) {
    var viewPortTag = document.createElement('meta');
    viewPortTag.id = "viewport";
    viewPortTag.name = "viewport";

    errorLog($(document).width() + ", " + $(document).height());
    var heightScale = $(window).height() / $(document).height();
    var widthScale = $(window).width() / $(document).width();
    errorLog("heightScale: " + heightScale + ", WidthScale: " + widthScale);
    var scale = Math.min(heightScale, widthScale).toFixed(2);

    viewPortTag.content = "width=device-width, height=device-height, user-scalable=yes"; //, initial-scale=" + scale + ", minimum-scale=0.25, maximum-scale=10";
    errorLog(viewPortTag.content);
    document.getElementsByTagName('head')[0].appendChild(viewPortTag);
//    document.getElementsByTagName('head')[0].appendChild(viewPortTag);
//    document.getElementsByTagName('head')[0].appendChild(viewPortTag);
//    document.getElementsByTagName('head')[0].appendChild(viewPortTag);
}

function isValidDate(d) {
    d = new Date(d);
    return d instanceof Date && !isNaN(d);
}

window.java2js = {
    getDiscoErrorMsg: function () {
        discoPageHandle(jQuery);

        var el = document.getElementById("ua");
        if (el) {
            return document.getElementById("ua").innerText.trim();
        }

        return "";
    },

    getBillDetail: function () {
        errorLog("getBillDetail Called");
        var tags = ["consumer", "bill_amount", "bill_month", "due_date", "ref_no", "late_amount", "issue_date"];
        var bill = {error: false, errorMessage: "A parsing error has occurred.", errorType: 0, wrongFields: []};

        if (typeof jQuery == "undefined") {
            bill.error = true;
            bill.errorType = 2;
            bill.errorMessage = "Wapda Server not reachable.";

            var body = document.body.innerText.trim();

            if (body.length < 50)
                bill.errorMessage = bill.errorMessage + " " + body;

            if (body.length > 1000) {
                bill.errorType = 7;
                bill.pageText = body;
            }

            return bill;
        }

        var $ = jQuery;
        billPageHandle($);
//        adjustViewPort();

        // bill = this.oldParserGetBill(bill);
        bill = newParserGetBill(bill);

        if (bill.errorType === 101 && $("body > h2").text().trim().length > 0) {
            bill.error = true;
            bill.errorType = 1;
            bill.errorMessage = $("body > h2").text().trim();

            if (bill.errorMessage.length > 0)
                return bill;
        }

        // check amount
        if (!bill.hasOwnProperty("bill_amount") || isNaN(bill.bill_amount)) {
            bill.error = true;
            bill.errorType = 3;
            bill.wrongFields.push("bill_amount");
        }

        // check late amount
        if (!bill.hasOwnProperty("late_amount") || isNaN(bill.late_amount)) {
            bill.error = true;
            bill.errorType = 4;
            bill.wrongFields.push("late_amount");
        }

        // check due date
        if (!bill.hasOwnProperty("due_date") || bill.due_date.length != 9 || !isValidDate(bill.due_date)) {
            bill.error = true;
            bill.errorType = 5;
            bill.wrongFields.push("due_date");
        }

        // check bill month
        if (!bill.hasOwnProperty("bill_month") || bill.bill_month.length != 6 || !isValidDate(bill.bill_month)) {
            bill.error = true;
            bill.errorType = 6;
            bill.wrongFields.push("bill_month");
        }

        errorLog("getBillDetail Ended");

        if (!bill.error) {
            bill.errorMessage = "";
        }

        return bill;
    },

    oldParserGetBill: function(bill = {}) {
        if (!bill)
            bill = {};

        var el = $("div.headertable table td.content");

        if (location.href.search("general") > 0) {
            el.each(function (i, r) {
                bill[tags[i]] = jQuery(r).text().trim();
            });

            bill[tags[0]] = el.eq(0).text().trim(); // consumer
            bill[tags[2]] = el.eq(2).text().trim(); // bill_month
            bill[tags[3]] = el.eq(3).text().trim(); // due_date
            bill[tags[4]] = el.eq(4).text().trim(); // ref_no

            bill[tags[1]] = el.eq(1).text().trim(); // bill_amount
            bill[tags[5]] = el.eq(5).text().trim(); // late_amount

            if (el.eq(1).find('div').length > 1) {
                bill[tags[1]] = el.eq(1).find('div:first').text().trim();
                bill[tags[5]] = el.eq(5).find('div:first').text().trim();
            }

            if (el.eq(5).find('div').length >= 3) {
                var t = el.eq(5).children('div:first').children("div:last").text().trim().split("\n");
                bill[tags[5]] = t[t.length - 1].trim();
            }


            bill[tags[6]] = jQuery('table.maintable tr.content:first td:nth(5)').text().trim(); // issue date
        } else if (location.href.search("industrial") > 0) {

            var el1 = $("div.headertable table td.bodyContentValue");
            bill[tags[0]] = el1.eq(0).text().trim(); // consumer
            bill[tags[1]] = el1.eq(29).text().trim(); // amount
            errorLog("industrial setup: " + el1.length);

            el = $("div.headertable table .bodyContentValue td");
            bill[tags[2]] = el.eq(0).text().trim(); // bill month
            bill[tags[3]] = el.eq(1).text().trim(); // due date
            bill[tags[4]] = el.eq(2).text().trim(); // ref no
            bill[tags[5]] = el.eq(4).text().trim(); // late amount
            bill[tags[6]] = jQuery('table.headertable tr.bodyContentValue:first td:nth(6)').text().trim(); // issue date

            if (el1.eq(29).find('div').length > 1) {
                bill[tags[1]] = el1.eq(29).find('div:first').text().trim();
                bill[tags[5]] = el.eq(4).find('div:first').text().trim();
            }
            debugger;
            if (el.eq(4).find('div').length >= 3) {
                var t = el.eq(4).children('div:first').children("div:last").text().trim().split("\n");
                bill[tags[5]] = t[t.length - 1].trim();
            }

            errorLog("industrial setup: " + el.length);
        }

        return bill;
    }
}

function errorLog(msg) {
    //console.log(msg + ", Timestamp: " + (new Date).getTime());
}

function newParserGetBill(bill = {}) {
    if (!bill)
        bill = {};

    var parser = getParser();
    if (location.href.search("general") > 0) {
        parser = parser.general;
    } else if (location.href.search("industrial") > 0) {
        parser = parser.industrial;
    }

    if (parser && parser.length > 0) {
        parser.forEach(function (selection, index) {
            var el = jQuery(selection.selector);
            if (!selection.if_selector) {
                bill = processFields(selection.fields, el, bill);

                if(el.length <= 0 && selection.fields.length >= 2) {
                    bill.errorType = 101;
                }
            } else {
                if (el.length > selection.select_num) {
                    // debugger;
                    if(typeof selection.search_inside != "undefined") {
                        // if there is need to search inside
                        var inside = el.eq(selection.select_num).find(selection.search_inside);
                        if (inside.length > selection.result_gt && inside.length < selection.result_lt) {
                            bill = processFields(selection.fields, inside, bill);
                        }
                    }
                    else {
                        bill = processFields(selection.fields, el, bill);
                    }
                }
            }
        });

        bill["__parser_used"] = parser;
    } else {
        bill.errorType = 101;
    }

    return bill;
}

function processFields(fields, elements, bill) {
    fields.forEach(function (field, i) {
        if (elements.length > field.index) {
            var value = elements.eq(field.index).text().trim();
            // debugger;
            if (field.hasOwnProperty("post_actions")) {
                field.post_actions.forEach(function (post_action, i) {
                    if (post_action.type === "split") {
                        var splits = value.split(new RegExp(post_action.param));
                        var indx = post_action.require_index < 0 ? splits.length + post_action.require_index : post_action.require_index;

                        if (splits.length > indx) {
                            value = (splits[indx]).trim();
                        }
                    }
                });
            }

            bill[field.name] = value;
        }
    });

    return bill;
}

errorLog("Script Loaded")
