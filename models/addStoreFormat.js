const setAddStore = function(gData){
var body1 = {
    "BillAddr": {
        "Line1": gData.city,
        "City": gData.city,
        "Country": gData.country,
        "CountrySubDivisionCode": "-",
        "PostalCode": gData.pincode
    },
    "Title": "Mr/Mrs",
    "GivenName": "",
    "MiddleName": "",
    "FamilyName": "",
    "Suffix": "",
    "FullyQualifiedName": gData.customer_name,
    "CompanyName": gData.name,
    "DisplayName": gData.display_name,
    "PrimaryPhone": {
        "FreeFormNumber": gData.phone
    },
    "PrimaryEmailAddr": {
        "Address": gData.email
    },

};
return body1
}
module.exports ={setAddStore}