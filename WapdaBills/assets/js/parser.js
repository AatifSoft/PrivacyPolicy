window.js_parser = {
    "general": [{
        "if_selector": false, // if total is less than 6
        "selector": "footer .slip-matrix-value",
        "fields": [
            {
                "name": "bill_amount", "index": 0,
                "post_actions": [{
                    "type": "txt_replace",
                    "find": " CR",
                    "replace": "",
                }]
            },
            { "name": "bill_month", "index": 1 },
            { "name": "due_date", "index": 2 },
        ]
    }, {
        "if_selector": false, // get late amount 
        "selector": ".lp-surcharge-card .lp-surcharge-bottom-val",
        "fields": [
            {
                "name": "late_amount",
                "index": -1,
                "post_actions": [ // remove dot and comma if exists
                    {
                        "type": "split",
                        "param": "[\.]+",
                        "require_index": 0
                    }, {
                        "type": "txt_replace",
                        "find": ",",
                        "replace": "",
                    }, {
                        "type": "txt_replace",
                        "find": " CR",
                        "replace": "",
                    }
                ]
            }
        ]
    }, {
        "if_selector": false,
        "selector": "footer .slip-id-value",
        "fields": [
            { "name": "consumer", "index": 0 },
            { "name": "ref_no", "index": 1 }
        ]
    }, {
        "if_selector": false,
        "selector": "main .right-grid-cell .right-panel-date-val",
        "fields": [
            { "name": "issue_date", "index": 1 }
        ]
    }, { // Reading does not work for Industrial, Green Meter, while works for general.
        "if_selector": true,
        "selector": "main .meter-info-grid .val-space",
        "select_num": 4,
        "fields": [
            { "name": "prev_reading", "index": 2 },
            { "name": "cur_reading", "index": 3 },
            { "name": "units", "index": 4 },
        ]
    }]
};