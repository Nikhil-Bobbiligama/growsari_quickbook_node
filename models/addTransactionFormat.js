const setAddTransaction = function(gData,qbid_trans){
    var kTPC = parseFloat(gData.total_product_cost);
    var kDC = parseFloat(gData.delivery_charges);
    var kPC = parseFloat(gData.processing_charges);
    // console.log("gdata");
    var body1 = {
        "Line": [
            {
                "Id": "1",
                "LineNum": 1,
                "Description": "Assorted Groceriesiiiiiii",
                "Amount": kTPC,
                "DetailType": "SalesItemLineDetail",
                "SalesItemLineDetail": {

                    "UnitPrice": kTPC,
                    "Qty": 1
                }
            },
            {
                "Id": "2",
                "LineNum": 2,
                "Description": "Delivery Chargesssssyy",
                "Amount": kDC,
                "DetailType": "SalesItemLineDetail",
                "SalesItemLineDetail":
                {

                    "UnitPrice": kDC,
                    "Qty": 1

                }
            },
            {
                "Id": "3",
                "LineNum": 3,
                "Description": "Processing Fees",
                "Amount": kPC,
                "DetailType": "SalesItemLineDetail",
                "SalesItemLineDetail":
                {

                    "UnitPrice": kPC,
                    "Qty": 1

                }
            },
            {
                "Amount": 3000,
                "DetailType": "SubTotalLineDetail",
                "SubTotalLineDetail": {}
            }
        ], "CustomerMemo": {
            "value": "Thank you for your business and have a great day!"
        },
        "CustomerRef":
        {
            "value": qbid_trans
        }
    };
    return body1
    }
    module.exports ={setAddTransaction}