window.js_parser = {
    "general": [{
        "if_selector": false,
        "selector": "div.headertable table td.content",
        "fields": [
            { "name": "consumer", "index": 0 },
            {
                "name": "bill_amount",
                "index": 2,
                "post_actions": [
                    {
                        "type": "split",
                        "param": "[\\s]+",
                        "require_index": 0
                    }
                ]
            },
            { "name": "bill_month", "index": 3 },
            { "name": "due_date", "index": 4 },
            { "name": "ref_no", "index": 5 },
            {
                "name": "late_amount",
                "index": 6, // working for credit amount / green meter.
                "post_actions": [
                    {
                        "type": "split",
                        "param": "[\\s]+",
                        "require_index": 0
                    }
                ]
            }
        ]
    }, {
        "if_selector": false,
        "selector": "table.maintable tr.content td",
        "fields": [
            { "name": "issue_date", "index": 5 }
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
    }],
};