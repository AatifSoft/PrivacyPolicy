window.js_parser = {
    "general": [{
        "if_selector": false, // if total is less than 6
        "selector": "footer .slip-matrix-value",
        "fields": [
            { "name": "bill_amount", "index": 0 },
            { "name": "bill_month", "index": 1 },
            { "name": "due_date", "index": 2 },
        ]
    }, {
        "if_selector": false, // get late amount 
        "selector": ".lp-surcharge-card .lp-surcharge-bottom-val",
        "fields": [
            {
                "name": "late_amount",
                "index": 1,
                "post_actions": [ // remove dot and comma if exists
                    {
                        "type": "split",
                        "param": "[\.]+",
                        "require_index": 0
                    }, {
                        "type": "txt_replace",
                        "find": ",",
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
    }, {
        "if_selector": false,
        "selector": "main .meter-info-grid .val-space",
        "fields": [
            { "name": "prev_reading", "index": 2 },
            { "name": "cur_reading", "index": 3 },
            { "name": "units", "index": 4 },
        ]
    }, {
        // normal bills without credit bill
        "if_selector": true,
        "selector": "div.headertable table td.content",
        "select_num": 6,
        "search_inside": "div",
        "result_lt": 4,
        "result_gt": 0,
        "fields": [{
            "name": "late_amount",
            "index": 2,
            "post_actions": [{
                "type": "split",
                "param": "[\\s]+",
                "require_index": 2
            }]
        }]
    }],
    "industrial": [{
        "if_selector": false,
        "selector": "div.headertable table:last td.bodyContentValue",
        "fields": [
            { "name": "bill_amount", "index": 0 }
        ]
    }, {
        "if_selector": false,
        "selector": "div.headertable table:last .bodyContentValue td",
        "fields": [
            { "name": "bill_month", "index": 0 },
            { "name": "due_date", "index": 1 },
            { "name": "ref_no", "index": 2 },
            {
                "name": "late_amount",
                "index": 4,
                "post_actions": [
                    {
                        "type": "split",
                        "param": "[\\s]+",
                        "require_index": 5
                    }
                ]
            }
        ]
    }, {
        "if_selector": false,
        "selector": "div.headertable table:eq(1) td.bodyContentValue",
        "fields": [
            { "name": "consumer", "index": 1 }
        ]
    }, {
        "if_selector": false,
        "selector": "table.headertable tr.bodyContentValue td",
        "fields": [
            { "name": "issue_date", "index": 6 }
        ]
    }]
};