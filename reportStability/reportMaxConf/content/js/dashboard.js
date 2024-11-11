/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7839750089466778, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9661016949152542, 500, 1500, "TR_Open_Reg"], "isController": true}, {"data": [0.7617647058823529, 500, 1500, "Delete"], "isController": false}, {"data": [0.9987951807228915, 500, 1500, "Open_Search_Page"], "isController": false}, {"data": [0.995952279505752, 500, 1500, "Get_Popular"], "isController": false}, {"data": [0.986336032388664, 500, 1500, "Choice_Product"], "isController": false}, {"data": [0.979328165374677, 500, 1500, "TR_Logout"], "isController": true}, {"data": [0.9946763202725724, 500, 1500, "GetAccountConfigurationRequest"], "isController": false}, {"data": [0.0, 500, 1500, "SC6_SelectFromSearch"], "isController": true}, {"data": [0.9399641577060932, 500, 1500, "Delete_From_Cart"], "isController": false}, {"data": [0.0, 500, 1500, "SC7_OpenOrders"], "isController": true}, {"data": [0.9948542024013722, 500, 1500, "Get_Acc"], "isController": false}, {"data": [0.49500891265597147, 500, 1500, "Get_All_Categories"], "isController": false}, {"data": [0.9982788296041308, 500, 1500, "Clear_Cart"], "isController": false}, {"data": [0.9399641577060932, 500, 1500, "TR_Delete_From_Cart"], "isController": true}, {"data": [0.9969512195121951, 500, 1500, "Open_Category_Page"], "isController": false}, {"data": [0.5024038461538461, 500, 1500, "Add_Cart"], "isController": false}, {"data": [0.7825159914712153, 500, 1500, "Get_Orders_Data"], "isController": false}, {"data": [0.5284588441330998, 500, 1500, "TR_Open_Cart"], "isController": true}, {"data": [0.9946740519812527, 500, 1500, "Load_Home"], "isController": false}, {"data": [0.9934282584884995, 500, 1500, "Login"], "isController": false}, {"data": [0.9939965694682675, 500, 1500, "Get_Countries"], "isController": false}, {"data": [0.9504008016032064, 500, 1500, "Get_User_Cart"], "isController": false}, {"data": [0.0, 500, 1500, "SC5_RemoveFromCart"], "isController": true}, {"data": [0.9118117797695262, 500, 1500, "Load_Category"], "isController": false}, {"data": [0.9831771720613288, 500, 1500, "Get_DealOfDay"], "isController": false}, {"data": [0.9830508474576272, 500, 1500, "TR_Reg"], "isController": true}, {"data": [0.6254180602006689, 500, 1500, "TR_OpenOrders"], "isController": true}, {"data": [0.9982847341337907, 500, 1500, "GetAccountPaymentPreferences"], "isController": false}, {"data": [0.0, 500, 1500, "SC1_Add_To_Cart"], "isController": true}, {"data": [0.9936440677966102, 500, 1500, "GetCountries"], "isController": false}, {"data": [0.9931856899488927, 500, 1500, "Get_App_Config"], "isController": false}, {"data": [0.9830508474576272, 500, 1500, "Create_Acc"], "isController": false}, {"data": [0.22647058823529412, 500, 1500, "TR_Delete_Order"], "isController": true}, {"data": [0.0, 500, 1500, "TR_Search"], "isController": true}, {"data": [0.981686541737649, 500, 1500, "Get_Categories"], "isController": false}, {"data": [0.5024038461538461, 500, 1500, "TR_Add_Cart"], "isController": true}, {"data": [0.9957356076759062, 500, 1500, "Open_Orders"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh"], "isController": false}, {"data": [0.9872881355932204, 500, 1500, "Open_Reg"], "isController": false}, {"data": [0.9957118353344768, 500, 1500, "Get_Acc_NewReq"], "isController": false}, {"data": [0.979328165374677, 500, 1500, "Logout"], "isController": false}, {"data": [0.0, 500, 1500, "TR_Open_Product"], "isController": true}, {"data": [0.9982847341337907, 500, 1500, "Shipping"], "isController": false}, {"data": [0.9783132530120482, 500, 1500, "Key_1"], "isController": false}, {"data": [0.977710843373494, 500, 1500, "Key_2"], "isController": false}, {"data": [0.7521514629948365, 500, 1500, "Purchase"], "isController": false}, {"data": [0.977710843373494, 500, 1500, "Key_3"], "isController": false}, {"data": [0.9838850174216028, 500, 1500, "Load_Attributes"], "isController": false}, {"data": [0.9725298126064736, 500, 1500, "Pre_Load_Home"], "isController": false}, {"data": [0.0, 500, 1500, "TR_Open_Home"], "isController": true}, {"data": [0.0, 500, 1500, "SC2_Register"], "isController": true}, {"data": [0.9982847341337907, 500, 1500, "Open_Payment-page"], "isController": false}, {"data": [0.7116648411829135, 500, 1500, "TR_Login"], "isController": true}, {"data": [0.9946835443037975, 500, 1500, "Open_Product"], "isController": false}, {"data": [0.0, 500, 1500, "SC4_RemoveOrder"], "isController": true}, {"data": [0.2478559176672384, 500, 1500, "TR_Shipping_Details"], "isController": true}, {"data": [0.9934325744308231, 500, 1500, "Open_Cart"], "isController": false}, {"data": [0.7773913043478261, 500, 1500, "Load_Cart"], "isController": false}, {"data": [0.49346689895470386, 500, 1500, "TR_Open_Category"], "isController": true}, {"data": [0.9978157267672756, 500, 1500, "Get_Service_Properties"], "isController": false}, {"data": [0.4974182444061962, 500, 1500, "TR_Purchase"], "isController": true}, {"data": [0.0, 500, 1500, "SC3_Buy"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50571, 0, 0.0, 332.736568388997, 132, 7735, 267.0, 623.0, 814.9500000000007, 1126.0, 12.900077521377048, 30.071698415425683, 7.166598880235084], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TR_Open_Reg", 236, 0, 0.0, 328.24576271186424, 273, 2224, 290.0, 354.1000000000001, 555.15, 1818.8599999999963, 0.06057564833269378, 0.4011502394791521, 0.08760989763742137], "isController": true}, {"data": ["Delete", 170, 0, 0.0, 522.8117647058822, 263, 1308, 488.0, 771.9, 921.8999999999995, 1234.8699999999992, 0.044160810813268093, 0.06658774464115055, 0.028249423084466384], "isController": false}, {"data": ["Open_Search_Page", 830, 0, 0.0, 149.86024096385512, 132, 611, 141.0, 170.89999999999998, 212.44999999999993, 403.5199999999995, 0.21289393393362582, 0.22516028364269214, 0.07276648132496977], "isController": false}, {"data": ["Get_Popular", 2347, 0, 0.0, 152.05283340434588, 132, 1625, 141.0, 156.0, 212.0, 449.55999999999995, 0.5990232373543438, 0.5218053981641354, 0.2720173880564159], "isController": false}, {"data": ["Choice_Product", 1976, 0, 0.0, 369.09868421052624, 273, 1610, 366.0, 416.0, 456.14999999999986, 733.23, 0.5059510702299005, 0.42367711062379465, 0.19261019222555995], "isController": false}, {"data": ["TR_Logout", 774, 0, 0.0, 294.8113695090436, 182, 1030, 219.0, 447.0, 491.25, 571.0, 0.19843162107866816, 0.20850822683656925, 0.22052464429721877], "isController": true}, {"data": ["GetAccountConfigurationRequest", 2348, 0, 0.0, 167.86456558773443, 140, 3943, 153.0, 184.0999999999999, 221.0, 467.5899999999979, 0.5992101042952238, 0.8759936778612792, 0.6261277456991108], "isController": false}, {"data": ["SC6_SelectFromSearch", 518, 0, 0.0, 6478.812741312739, 5418, 18808, 6242.0, 6992.0, 7808.499999999996, 11462.429999999995, 0.13266074166574257, 6.6633146206671094, 1.0076233487995354], "isController": true}, {"data": ["Delete_From_Cart", 558, 0, 0.0, 322.0035842293909, 180, 1649, 262.0, 540.4000000000001, 704.7999999999993, 883.3799999999994, 0.1437843420397587, 0.0831804316177903, 0.09167575424614746], "isController": false}, {"data": ["SC7_OpenOrders", 128, 0, 0.0, 3591.8906250000005, 2792, 7563, 3507.0, 4193.7, 4713.399999999999, 6930.7999999999865, 0.03415297812635161, 0.9630742728217271, 0.262284720337805], "isController": true}, {"data": ["Get_Acc", 583, 0, 0.0, 188.04631217838767, 151, 710, 166.0, 242.0, 259.39999999999986, 530.1199999999998, 0.15030619408474227, 0.288524536599945, 0.16733608890392238], "isController": false}, {"data": ["Get_All_Categories", 2805, 0, 0.0, 917.1258467023164, 702, 2291, 859.0, 1156.0, 1260.0, 1502.8200000000002, 0.7179212073156811, 6.717287243538325, 0.27571651591814317], "isController": false}, {"data": ["Clear_Cart", 581, 0, 0.0, 221.61273666092947, 179, 555, 200.0, 281.0, 316.0, 460.0, 0.1501777836137169, 0.061743519398911484, 0.10149035941343297], "isController": false}, {"data": ["TR_Delete_From_Cart", 558, 0, 0.0, 322.0035842293909, 180, 1649, 262.0, 540.4000000000001, 704.7999999999993, 883.3799999999994, 0.1437843420397587, 0.0831804316177903, 0.09167575424614746], "isController": true}, {"data": ["Open_Category_Page", 1148, 0, 0.0, 148.58623693379798, 132, 775, 141.0, 150.0, 205.0, 416.54999999999995, 0.2939063585667815, 0.31026638047919025, 0.10131732868561902], "isController": false}, {"data": ["Add_Cart", 1456, 0, 0.0, 779.0123626373621, 484, 2276, 731.0, 1039.0, 1155.0, 1479.400000000005, 0.37390051164792537, 0.22755647372719748, 0.280409835310435], "isController": false}, {"data": ["Get_Orders_Data", 469, 0, 0.0, 510.86140724946694, 209, 1355, 466.0, 830.0, 995.5, 1280.2, 0.1200971737217141, 0.16847903795377975, 0.05465359663507693], "isController": false}, {"data": ["TR_Open_Cart", 1142, 0, 0.0, 691.0849387040272, 440, 3387, 630.0, 919.7, 1054.0, 1646.6299999999962, 0.2937864676602069, 0.7199985281735305, 0.24329895287762815], "isController": true}, {"data": ["Load_Home", 2347, 0, 0.0, 155.01193012356163, 132, 2453, 142.0, 164.0, 214.0, 510.55999999999995, 0.5990246133521999, 1.537925496584896, 0.2521285237839826], "isController": false}, {"data": ["Login", 1826, 0, 0.0, 259.11500547645215, 182, 1498, 214.0, 369.29999999999995, 405.64999999999986, 584.3000000000002, 0.4667376571405494, 0.6732243592389773, 0.5179358594209692], "isController": false}, {"data": ["Get_Countries", 583, 0, 0.0, 171.57975986277864, 136, 7735, 146.0, 170.20000000000005, 214.5999999999999, 515.5999999999997, 0.15030770539689742, 0.7232583952686589, 0.15030770539689742], "isController": false}, {"data": ["Get_User_Cart", 1996, 0, 0.0, 294.69839679358694, 166, 1816, 244.0, 495.0, 619.2999999999997, 921.0, 0.5102029079009623, 0.27387026424791466, 0.2391905631505183], "isController": false}, {"data": ["SC5_RemoveFromCart", 558, 0, 0.0, 7202.978494623664, 5800, 26823, 6901.0, 8507.1, 9121.249999999995, 13182.329999999984, 0.1434701785149551, 6.775421313083169, 1.5174609317751735], "isController": true}, {"data": ["Load_Category", 3124, 0, 0.0, 472.2970550576186, 394, 2048, 450.0, 531.0, 573.0, 804.0, 0.7995031001218961, 1.9427288824749636, 0.3048981305344924], "isController": false}, {"data": ["Get_DealOfDay", 2348, 0, 0.0, 398.35689948892684, 340, 2096, 381.0, 443.0, 476.5499999999997, 673.5299999999993, 0.5991873202980319, 0.4144976735876035, 0.27852848091978827], "isController": false}, {"data": ["TR_Reg", 236, 0, 0.0, 278.3601694915254, 160, 1691, 268.5, 323.6, 361.7499999999999, 1043.5599999999977, 0.060575881558750905, 0.06607740205187965, 0.09339500303521102], "isController": true}, {"data": ["TR_OpenOrders", 299, 0, 0.0, 697.4247491638797, 367, 1476, 632.0, 1068.0, 1268.0, 1454.0, 0.07656242398170697, 0.24410124052251933, 0.061833129524288724], "isController": true}, {"data": ["GetAccountPaymentPreferences", 583, 0, 0.0, 188.88850771869647, 152, 803, 164.0, 259.20000000000005, 280.79999999999995, 419.79999999999984, 0.15030662034919606, 0.1321054280412856, 0.1733546996310398], "isController": false}, {"data": ["SC1_Add_To_Cart", 312, 0, 0.0, 7247.3076923076915, 6290, 17666, 6927.5, 8067.9, 9140.849999999997, 12668.720000000001, 0.08000106668088908, 4.205809282585307, 0.7939846950363184], "isController": true}, {"data": ["GetCountries", 236, 0, 0.0, 160.46186440677965, 135, 1058, 145.0, 169.3, 222.9499999999997, 665.9199999999992, 0.060578136169896005, 0.29148715955279986, 0.06069645284210283], "isController": false}, {"data": ["Get_App_Config", 2348, 0, 0.0, 165.91822827938677, 135, 7098, 145.0, 176.0999999999999, 218.0, 523.0, 0.5992071988569128, 4.036821659585746, 0.28204870102444524], "isController": false}, {"data": ["Create_Acc", 236, 0, 0.0, 278.3601694915254, 160, 1691, 268.5, 323.6, 361.7499999999999, 1043.5599999999977, 0.060582956936042626, 0.06608512001714806, 0.09340591174783114], "isController": false}, {"data": ["TR_Delete_Order", 170, 0, 0.0, 1618.0470588235294, 1079, 3092, 1578.0, 2039.8000000000002, 2285.7999999999993, 2988.339999999999, 0.044150752484648524, 0.4268965373701059, 0.11904724899907647], "isController": true}, {"data": ["TR_Search", 830, 0, 0.0, 2342.7867469879525, 1953, 4780, 2286.5, 2609.9, 2790.2499999999995, 3888.7299999999873, 0.2127860851231506, 2.736379683665284, 0.4095716540798143], "isController": true}, {"data": ["Get_Categories", 2348, 0, 0.0, 399.87010221465175, 332, 7185, 376.0, 438.0, 469.5499999999997, 752.0999999999976, 0.5991824273165942, 3.0879187789622917, 0.2668234246644208], "isController": false}, {"data": ["TR_Add_Cart", 1456, 0, 0.0, 779.0123626373621, 484, 2276, 731.0, 1039.0, 1155.0, 1479.400000000005, 0.3739004156303727, 0.22755641529075507, 0.2804097633012633], "isController": true}, {"data": ["Open_Orders", 469, 0, 0.0, 148.8528784648188, 133, 676, 141.0, 151.0, 201.5, 440.00000000000114, 0.12011842806212351, 0.2139609499856575, 0.04234643801799472], "isController": false}, {"data": ["Refresh", 170, 0, 0.0, 148.04117647058843, 133, 419, 142.0, 153.60000000000002, 203.89999999999975, 384.2099999999996, 0.04416612281715433, 0.14211657683840187, 0.016303510180551112], "isController": false}, {"data": ["Open_Reg", 236, 0, 0.0, 167.78389830508465, 135, 1674, 143.0, 159.3, 271.5999999999999, 996.1799999999992, 0.060577825179070365, 0.10967899207226216, 0.026916904742653333], "isController": false}, {"data": ["Get_Acc_NewReq", 583, 0, 0.0, 185.5780445969126, 149, 969, 164.0, 236.0, 257.79999999999995, 469.71999999999866, 0.15030619408474227, 0.27898361607698774, 0.16689573872593974], "isController": false}, {"data": ["Logout", 774, 0, 0.0, 294.8100775193799, 182, 1030, 219.0, 447.0, 491.25, 571.0, 0.19843162107866816, 0.20850822683656925, 0.22052464429721877], "isController": false}, {"data": ["TR_Open_Product", 1975, 0, 0.0, 1898.8754430379759, 1565, 5239, 1806.0, 2210.4, 2366.199999999999, 3214.8, 0.5062576002723281, 7.7499665225146215, 0.7538619744885902], "isController": true}, {"data": ["Shipping", 583, 0, 0.0, 177.974271012007, 151, 671, 168.0, 203.0, 226.5999999999999, 300.4799999999999, 0.1503060390800858, 0.0876580453176575, 0.13063935069789182], "isController": false}, {"data": ["Key_1", 830, 0, 0.0, 404.675903614458, 345, 1178, 390.0, 446.9, 486.89999999999986, 690.8299999999996, 0.21290070541955416, 0.24896572220087515, 0.08565926819614876], "isController": false}, {"data": ["Key_2", 830, 0, 0.0, 411.6180722891567, 351, 2038, 393.0, 451.0, 494.44999999999993, 748.8999999999994, 0.21290278063856982, 0.14059093435271014, 0.08586801601926693], "isController": false}, {"data": ["Purchase", 581, 0, 0.0, 534.5851979345962, 360, 1394, 500.0, 700.6000000000001, 747.8, 946.2799999999952, 0.15016555688030928, 0.07583367689735215, 0.25348337932530435], "isController": false}, {"data": ["Key_3", 830, 0, 0.0, 419.3530120481927, 354, 2237, 400.0, 462.0, 494.44999999999993, 806.3599999999974, 0.21290146996922163, 0.13117317671694134, 0.08607539899146266], "isController": false}, {"data": ["Load_Attributes", 1148, 0, 0.0, 396.1367595818821, 343, 1170, 381.0, 441.0, 469.0, 745.6099999999999, 0.2938871724137225, 0.2609862650626776, 0.11049468884695621], "isController": false}, {"data": ["Pre_Load_Home", 2348, 0, 0.0, 377.95698466780243, 282, 4963, 370.0, 416.0, 498.5499999999997, 1431.039999999999, 0.5991648438241619, 1.9279784635421717, 0.28202876437817], "isController": false}, {"data": ["TR_Open_Home", 2347, 0, 0.0, 1967.952279505752, 1705, 15818, 1818.0, 2205.2000000000003, 2594.3999999999996, 4715.559999999998, 0.5987335013460662, 13.15765802701176, 2.5036883327772026], "isController": true}, {"data": ["SC2_Register", 236, 0, 0.0, 3587.4449152542384, 2787, 10874, 3434.0, 3963.8, 4652.649999999997, 8263.199999999993, 0.06052182119392115, 1.9776654084133025, 0.5965235094257607], "isController": true}, {"data": ["Open_Payment-page", 583, 0, 0.0, 147.07718696397947, 132, 640, 141.0, 151.0, 198.0, 293.5199999999953, 0.15030774414889078, 0.1906735934076261, 0.05328292102153062], "isController": false}, {"data": ["TR_Login", 1826, 0, 0.0, 561.9906900328592, 353, 3202, 540.0, 799.0, 918.9499999999996, 1282.73, 0.4666930427466291, 0.9256527281096427, 0.73663723366421], "isController": true}, {"data": ["Open_Product", 1975, 0, 0.0, 154.26379746835468, 132, 1894, 142.0, 161.0, 212.0, 515.48, 0.5064586946392565, 1.3576456218601163, 0.17409517628224444], "isController": false}, {"data": ["SC4_RemoveOrder", 170, 0, 0.0, 11456.858823529412, 9357, 22978, 11050.5, 12855.6, 14380.549999999996, 22086.23999999999, 0.04403722959198211, 3.192203827774281, 0.9640869714237237], "isController": true}, {"data": ["TR_Shipping_Details", 583, 0, 0.0, 1587.521440823329, 1222, 9807, 1505.0, 1906.6000000000001, 2155.8, 2830.0399999999977, 0.15025986193103252, 1.7976220809025643, 0.9143397369357039], "isController": true}, {"data": ["Open_Cart", 1142, 0, 0.0, 154.26532399299495, 132, 1595, 142.0, 160.70000000000005, 207.0, 509.27999999999975, 0.2938178360290648, 0.5308232389196972, 0.10099988113499102], "isController": false}, {"data": ["Load_Cart", 1725, 0, 0.0, 533.9663768115932, 305, 2071, 478.0, 761.4000000000001, 895.7999999999993, 1209.5000000000002, 0.4437823012414842, 0.28601397486545677, 0.21496710158189739], "isController": false}, {"data": ["TR_Open_Category", 1148, 0, 0.0, 1011.9207317073169, 887, 2360, 973.0, 1139.3000000000004, 1235.55, 1607.04, 0.2938232366574689, 1.2833498791530367, 0.3265340266759762], "isController": true}, {"data": ["Get_Service_Properties", 2518, 0, 0.0, 150.61596505162825, 132, 2285, 141.0, 157.0999999999999, 210.0, 422.80999999999995, 0.6425929928781404, 0.819557078807472, 0.26356353223517476], "isController": false}, {"data": ["TR_Purchase", 581, 0, 0.0, 756.1979345955248, 561, 1712, 697.0, 985.0, 1036.1, 1332.1599999999994, 0.15015779490822928, 0.1375650584168096, 0.35494712793172756], "isController": true}, {"data": ["SC3_Buy", 410, 0, 0.0, 9418.517073170731, 7726, 16872, 9038.0, 10840.800000000001, 11858.65, 15687.959999999988, 0.1058271800850799, 6.425337670172041, 2.0634702021312044], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50571, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
