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

    var data = {"OkPercent": 99.99918579372898, "KoPercent": 8.142062710166994E-4};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7394294838333282, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "TR_Open_Reg"], "isController": true}, {"data": [0.772289156626506, 500, 1500, "Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Open_Search_Page"], "isController": false}, {"data": [1.0, 500, 1500, "Get_Popular"], "isController": false}, {"data": [0.8619970815092767, 500, 1500, "Choice_Product"], "isController": false}, {"data": [0.9545697487974345, 500, 1500, "TR_Logout"], "isController": true}, {"data": [0.9995617110799438, 500, 1500, "GetAccountConfigurationRequest"], "isController": false}, {"data": [0.0, 500, 1500, "SC6_SelectFromSearch"], "isController": true}, {"data": [0.8927514792899408, 500, 1500, "Delete_From_Cart"], "isController": false}, {"data": [0.0, 500, 1500, "SC7_OpenOrders"], "isController": true}, {"data": [0.9992937853107344, 500, 1500, "Get_Acc"], "isController": false}, {"data": [0.30318602261048305, 500, 1500, "Get_All_Categories"], "isController": false}, {"data": [0.9720254957507082, 500, 1500, "Clear_Cart"], "isController": false}, {"data": [0.8927514792899408, 500, 1500, "TR_Delete_From_Cart"], "isController": true}, {"data": [1.0, 500, 1500, "Open_Category_Page"], "isController": false}, {"data": [0.4144029428409734, 500, 1500, "Add_Cart"], "isController": false}, {"data": [0.8334801762114538, 500, 1500, "Get_Orders_Data"], "isController": false}, {"data": [0.5010826416456153, 500, 1500, "TR_Open_Cart"], "isController": true}, {"data": [0.9995616342275995, 500, 1500, "Load_Home"], "isController": false}, {"data": [0.9861236462093863, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Get_Countries"], "isController": false}, {"data": [0.913554776150196, 500, 1500, "Get_User_Cart"], "isController": false}, {"data": [0.0, 500, 1500, "SC5_RemoveFromCart"], "isController": true}, {"data": [0.7349683544303798, 500, 1500, "Load_Category"], "isController": false}, {"data": [0.8588462212870419, 500, 1500, "Get_DealOfDay"], "isController": false}, {"data": [0.9973821989528796, 500, 1500, "TR_Reg"], "isController": true}, {"data": [0.7066574202496533, 500, 1500, "TR_OpenOrders"], "isController": true}, {"data": [0.9996468926553672, 500, 1500, "GetAccountPaymentPreferences"], "isController": false}, {"data": [0.0, 500, 1500, "SC1_Add_To_Cart"], "isController": true}, {"data": [1.0, 500, 1500, "GetCountries"], "isController": false}, {"data": [0.9995617110799438, 500, 1500, "Get_App_Config"], "isController": false}, {"data": [0.9973821989528796, 500, 1500, "Create_Acc"], "isController": false}, {"data": [0.27602905569007263, 500, 1500, "TR_Delete_Order"], "isController": true}, {"data": [0.0, 500, 1500, "TR_Search"], "isController": true}, {"data": [0.8795582047685835, 500, 1500, "Get_Categories"], "isController": false}, {"data": [0.4144029428409734, 500, 1500, "TR_Add_Cart"], "isController": true}, {"data": [0.9991181657848325, 500, 1500, "Open_Orders"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh"], "isController": false}, {"data": [1.0, 500, 1500, "Open_Reg"], "isController": false}, {"data": [0.9992937853107344, 500, 1500, "Get_Acc_NewReq"], "isController": false}, {"data": [0.9545697487974345, 500, 1500, "Logout"], "isController": false}, {"data": [0.004171011470281543, 500, 1500, "TR_Open_Product"], "isController": true}, {"data": [0.9996468926553672, 500, 1500, "Shipping"], "isController": false}, {"data": [0.8523738872403561, 500, 1500, "Key_1"], "isController": false}, {"data": [0.8400198117880139, 500, 1500, "Key_2"], "isController": false}, {"data": [0.6832979476291579, 500, 1500, "Purchase"], "isController": false}, {"data": [0.816468253968254, 500, 1500, "Key_3"], "isController": false}, {"data": [0.8614198637504482, 500, 1500, "Load_Attributes"], "isController": false}, {"data": [0.9929898352611286, 500, 1500, "Pre_Load_Home"], "isController": false}, {"data": [0.0, 500, 1500, "TR_Open_Home"], "isController": true}, {"data": [0.0, 500, 1500, "SC2_Register"], "isController": true}, {"data": [1.0, 500, 1500, "Open_Payment-page"], "isController": false}, {"data": [0.7061146209386282, 500, 1500, "TR_Login"], "isController": true}, {"data": [0.9995828988529718, 500, 1500, "Open_Product"], "isController": false}, {"data": [0.0, 500, 1500, "SC4_RemoveOrder"], "isController": true}, {"data": [0.23622881355932204, 500, 1500, "TR_Shipping_Details"], "isController": true}, {"data": [0.9994586791771923, 500, 1500, "Open_Cart"], "isController": false}, {"data": [0.6872015281757402, 500, 1500, "Load_Cart"], "isController": false}, {"data": [0.38831122266045176, 500, 1500, "TR_Open_Category"], "isController": true}, {"data": [1.0, 500, 1500, "Get_Service_Properties"], "isController": false}, {"data": [0.43130311614730876, 500, 1500, "TR_Purchase"], "isController": true}, {"data": [0.0, 500, 1500, "SC3_Buy"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 122819, 1, 8.142062710166994E-4, 404.4349978423558, 131, 5724, 364.0, 1260.0, 1848.0, 2946.0, 19.492449431425918, 45.20250538493814, 10.82843500901664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TR_Open_Reg", 574, 0, 0.0, 282.0888501742157, 270, 397, 277.0, 296.5, 307.25, 345.25, 0.09127819367133617, 0.6045295059345138, 0.13201465315161023], "isController": true}, {"data": ["Delete", 415, 0, 0.0, 583.2192771084333, 180, 2535, 435.0, 1212.8000000000002, 1551.7999999999997, 2142.3199999999974, 0.06645813225744823, 0.07046147781387335, 0.042511717099180994], "isController": false}, {"data": ["Open_Search_Page", 2014, 0, 0.0, 138.07547169811318, 132, 445, 135.0, 142.0, 153.25, 195.8499999999999, 0.32017413403150585, 0.33862166714464925, 0.10943451846779984], "isController": false}, {"data": ["Get_Popular", 5703, 0, 0.0, 137.87936173943547, 131, 467, 135.0, 141.0, 153.0, 183.96000000000004, 0.9058067405807932, 0.7890425904278003, 0.41132825622077035], "isController": false}, {"data": ["Choice_Product", 4797, 0, 0.0, 461.91432145090613, 266, 1487, 379.0, 758.0, 895.0, 1114.0, 0.763075603501017, 0.6422917436019046, 0.2904957162399891], "isController": false}, {"data": ["TR_Logout", 1871, 0, 0.0, 307.28487439871645, 178, 1052, 281.0, 490.0, 595.3999999999999, 751.0799999999997, 0.29789037570488247, 0.3130176213461461, 0.33106141586849774], "isController": true}, {"data": ["GetAccountConfigurationRequest", 5704, 0, 0.0, 160.89621318373042, 140, 629, 152.0, 186.0, 201.0, 238.0, 0.9055579572174668, 1.3238479120649882, 0.9462373185768452], "isController": false}, {"data": ["SC6_SelectFromSearch", 1255, 0, 0.0, 8592.443027888443, 5058, 16442, 8278.0, 12016.6, 12902.600000000002, 14790.520000000002, 0.19997151003506433, 9.996725198882023, 1.5188890568817766], "isController": true}, {"data": ["Delete_From_Cart", 1352, 0, 0.0, 393.75369822485214, 178, 2987, 297.0, 708.8000000000002, 996.4499999999994, 1601.9900000000005, 0.21598220383320488, 0.12371806744251991, 0.13770525398277095], "isController": false}, {"data": ["SC7_OpenOrders", 305, 0, 0.0, 3698.8360655737697, 2547, 8171, 3376.0, 5379.6, 5846.599999999999, 7373.98, 0.05108132465095963, 1.4158210033866918, 0.39229188149434147], "isController": true}, {"data": ["Get_Acc", 1416, 0, 0.0, 188.36299435028238, 149, 604, 173.0, 241.0, 274.14999999999986, 350.97999999999956, 0.22619754106020512, 0.43416975513437267, 0.25182834525955605], "isController": false}, {"data": ["Get_All_Categories", 6811, 0, 0.0, 1453.1732491557827, 641, 4645, 1208.0, 2537.6000000000004, 2939.3999999999996, 3744.5200000000004, 1.0823542723038715, 10.028054550283866, 0.415674914969797], "isController": false}, {"data": ["Clear_Cart", 1412, 0, 0.0, 268.6395184135978, 174, 1322, 220.0, 418.0, 509.3499999999999, 728.9599999999991, 0.22575034410140093, 0.09290814641980259, 0.1525647195619548], "isController": false}, {"data": ["TR_Delete_From_Cart", 1352, 0, 0.0, 393.75369822485214, 178, 2987, 297.0, 708.8000000000002, 996.4499999999994, 1601.9900000000005, 0.21598220383320488, 0.12371806744251991, 0.13770525398277095], "isController": true}, {"data": ["Open_Category_Page", 2789, 0, 0.0, 138.1104338472574, 131, 445, 135.0, 142.0, 155.0, 186.29999999999973, 0.44367795502801344, 0.46837487244656495, 0.15294757629383665], "isController": false}, {"data": ["Add_Cart", 3534, 0, 0.0, 1083.511884550084, 468, 5700, 860.5, 1898.0, 2295.5, 3162.3500000000017, 0.5632363490490725, 0.3433135115025166, 0.42241340973268904], "isController": false}, {"data": ["Get_Orders_Data", 1135, 0, 0.0, 483.2634361233477, 142, 2484, 347.0, 1078.0, 1421.4, 1918.400000000001, 0.18051913805053965, 0.17502282856351936, 0.08215031087065573], "isController": false}, {"data": ["TR_Open_Cart", 2771, 0, 0.0, 838.7758931793572, 434, 4307, 690.0, 1387.0, 1700.2000000000007, 2575.520000000007, 0.44217821681062325, 1.0832116838752077, 0.3661937958135569], "isController": true}, {"data": ["Load_Home", 5703, 0, 0.0, 138.83640189374046, 131, 546, 135.0, 143.0, 155.80000000000018, 184.0, 0.9058042948115822, 2.3255485494841857, 0.3812516123669843], "isController": false}, {"data": ["Login", 4432, 0, 0.0, 268.8370938628157, 176, 721, 248.0, 384.7000000000003, 445.34999999999945, 566.3400000000001, 0.7042864538954573, 1.0158564180188796, 0.7815502518594784], "isController": false}, {"data": ["Get_Countries", 1416, 0, 0.0, 142.40960451977406, 134, 422, 139.0, 151.0, 162.0, 194.65999999999985, 0.22619157915587093, 1.0884599289676973, 0.2261915791558709], "isController": false}, {"data": ["Get_User_Cart", 4847, 0, 0.0, 351.8163812667631, 163, 4515, 242.0, 644.0, 865.1999999999989, 1642.1599999999962, 0.7702367917977012, 0.4097617062544594, 0.3610865166152328], "isController": false}, {"data": ["SC5_RemoveFromCart", 1352, 0, 0.0, 8717.179733727819, 5606, 22637, 7841.0, 12405.2, 13583.8, 16709.33, 0.21573651040449957, 10.17099409129093, 2.2818007379521053], "isController": true}, {"data": ["Load_Category", 7584, 0, 0.0, 638.1209124472575, 364, 2196, 507.0, 1087.5, 1273.0, 1640.449999999999, 1.2063568516185845, 2.9290740705134986, 0.4600604645312952], "isController": false}, {"data": ["Get_DealOfDay", 5703, 0, 0.0, 481.28791863931195, 313, 1651, 397.0, 773.6000000000004, 923.6000000000004, 1196.6400000000003, 0.9057749466112137, 0.6267192667745455, 0.42104382283880637], "isController": false}, {"data": ["TR_Reg", 573, 0, 0.0, 243.64048865619526, 159, 653, 225.0, 329.0, 360.0, 447.1999999999998, 0.09121078254712715, 0.09949457432142679, 0.14061569039160465], "isController": true}, {"data": ["TR_OpenOrders", 721, 0, 0.0, 656.5963938973657, 277, 2256, 514.0, 1295.0000000000005, 1663.6999999999994, 2089.9799999999987, 0.11472188931835786, 0.3171063347108181, 0.09265136959597846], "isController": true}, {"data": ["GetAccountPaymentPreferences", 1416, 0, 0.0, 192.33968926553723, 149, 514, 175.0, 255.0, 295.14999999999986, 387.0, 0.22619103718015174, 0.19880071627161774, 0.260877581489075], "isController": false}, {"data": ["SC1_Add_To_Cart", 755, 0, 0.0, 8893.049006622514, 5903, 19015, 7848.0, 12946.199999999999, 13860.999999999998, 15929.319999999989, 0.12036184437070045, 6.304263276808169, 1.1945637494416326], "isController": true}, {"data": ["GetCountries", 574, 0, 0.0, 142.156794425087, 135, 219, 139.0, 153.0, 157.0, 199.0, 0.09128040003078726, 0.43927667548434274, 0.0914586820620974], "isController": false}, {"data": ["Get_App_Config", 5704, 0, 0.0, 143.0799438990184, 134, 782, 138.0, 157.0, 165.0, 200.79999999999927, 0.905556807099413, 6.10097646268698, 0.4262484189667159], "isController": false}, {"data": ["Create_Acc", 573, 0, 0.0, 243.64048865619526, 159, 653, 225.0, 329.0, 360.0, 447.1999999999998, 0.09121778125880538, 0.09950220865828673, 0.14062648000054126], "isController": false}, {"data": ["TR_Delete_Order", 413, 0, 0.0, 1664.859564164649, 899, 5611, 1410.0, 2744.4, 3337.899999999997, 4925.980000000007, 0.06623242996361546, 0.5807789717066445, 0.1785855351440018], "isController": true}, {"data": ["TR_Search", 2014, 0, 0.0, 3252.5347567030713, 1789, 7783, 2901.5, 5206.0, 5964.25, 7013.149999999998, 0.3200814221023692, 4.087874683444797, 0.6160942216443063], "isController": true}, {"data": ["Get_Categories", 5704, 0, 0.0, 460.8262622720888, 306, 1450, 384.0, 732.0, 876.0, 1132.8999999999996, 0.9054804745454262, 4.636640049773249, 0.40322177382101015], "isController": false}, {"data": ["TR_Add_Cart", 3534, 0, 0.0, 1083.511884550084, 468, 5700, 860.5, 1898.0, 2295.5, 3162.3500000000017, 0.563236259282481, 0.3433134567864391, 0.42241334240995315], "isController": true}, {"data": ["Open_Orders", 1134, 0, 0.0, 140.56613756613774, 132, 531, 135.0, 143.0, 155.0, 371.6500000000001, 0.18044791181666492, 0.32142284292343437, 0.06361493766192972], "isController": false}, {"data": ["Refresh", 415, 0, 0.0, 146.03373493975903, 132, 413, 135.0, 147.40000000000003, 179.39999999999998, 382.5599999999998, 0.06646098459946846, 0.21385639087426622, 0.024533449393163164], "isController": false}, {"data": ["Open_Reg", 574, 0, 0.0, 139.9320557491289, 134, 259, 137.0, 145.5, 155.0, 180.25, 0.09128021132482095, 0.16526710136349418, 0.040559078274212436], "isController": false}, {"data": ["Get_Acc_NewReq", 1416, 0, 0.0, 187.3806497175143, 146, 560, 172.0, 244.0, 277.0, 368.97999999999956, 0.22619479493189476, 0.419806416102817, 0.2511626078997893], "isController": false}, {"data": ["Logout", 1871, 0, 0.0, 307.28433992517404, 178, 1052, 281.0, 490.0, 595.3999999999999, 751.0799999999997, 0.29789037570488247, 0.3130176213461461, 0.33106141586849774], "isController": false}, {"data": ["TR_Open_Product", 4795, 0, 0.0, 2640.444004171011, 1432, 7085, 2248.0, 4300.0, 4949.4, 5988.16, 0.7626960661743419, 11.605081090487962, 1.1357224596236337], "isController": true}, {"data": ["Shipping", 1416, 0, 0.0, 167.6850282485878, 151, 602, 162.0, 188.0, 198.0, 220.82999999999993, 0.22619421680811524, 0.13172042975862872, 0.19658210314935512], "isController": false}, {"data": ["Key_1", 2022, 0, 0.0, 492.8679525222551, 321, 1574, 403.5, 798.7, 934.0, 1226.7799999999997, 0.32129096042639216, 0.37664939688029975, 0.12926940985905624], "isController": false}, {"data": ["Key_2", 2019, 0, 0.0, 505.2486379395735, 320, 1443, 414.0, 820.0, 971.0, 1249.8, 0.32083124371923977, 0.21191311961626422, 0.12939775747660745], "isController": false}, {"data": ["Purchase", 1413, 1, 0.07077140835102619, 696.7459306440195, 347, 2429, 540.0, 1244.2000000000003, 1491.0, 1987.6999999999955, 0.22581736537137848, 0.1141715888752745, 0.3812470631656558], "isController": false}, {"data": ["Key_3", 2016, 0, 0.0, 524.3789682539687, 314, 1537, 430.0, 870.0, 995.0, 1264.2999999999993, 0.32040630571052725, 0.19730454743523174, 0.1295392681290608], "isController": false}, {"data": ["Load_Attributes", 2789, 0, 0.0, 479.19827895302956, 314, 1422, 388.0, 782.0, 943.0, 1189.5999999999995, 0.4436634864155299, 0.39405362001924504, 0.16680707252927637], "isController": false}, {"data": ["Pre_Load_Home", 5706, 0, 0.0, 386.10129688047726, 362, 1613, 372.0, 402.0, 424.64999999999964, 633.3000000000029, 0.9056851025276488, 2.914290550687414, 0.42630880802570964], "isController": false}, {"data": ["TR_Open_Home", 5703, 0, 0.0, 2046.6431702612601, 1683, 4176, 1893.0, 2615.6000000000004, 2911.0, 3406.7200000000003, 0.9055462684443722, 19.87074053455652, 3.7866690639441423], "isController": true}, {"data": ["SC2_Register", 572, 0, 0.0, 3586.293706293709, 2740, 6101, 3383.0, 4477.400000000001, 4883.85, 5336.259999999999, 0.09109719242275213, 2.9737842409282647, 0.8978708549582992], "isController": true}, {"data": ["Open_Payment-page", 1416, 0, 0.0, 137.7224576271186, 132, 440, 135.0, 143.0, 154.0, 182.65999999999985, 0.22619157915587093, 0.28693638801120736, 0.08018314768904408], "isController": false}, {"data": ["TR_Login", 4432, 0, 0.0, 631.5227888086642, 346, 4880, 527.0, 997.4000000000005, 1255.3499999999995, 2028.0100000000002, 0.7042438158192674, 1.3931361130532196, 1.1115889828825214], "isController": true}, {"data": ["Open_Product", 4795, 0, 0.0, 138.82961418143876, 132, 535, 135.0, 143.0, 155.0, 189.07999999999993, 0.7629289406870879, 2.0451561935410707, 0.2622568233611865], "isController": false}, {"data": ["SC4_RemoveOrder", 413, 0, 0.0, 13548.748184019376, 8414, 28325, 12213.0, 19887.2, 21069.8, 25870.360000000004, 0.0661291789477999, 4.69976277583113, 1.4476317310157218], "isController": true}, {"data": ["TR_Shipping_Details", 1416, 0, 0.0, 1704.610169491526, 1192, 6900, 1522.5, 2341.5, 2662.099999999998, 3557.889999999994, 0.22614320902004767, 2.7049602750147366, 1.376087565573146], "isController": true}, {"data": ["Open_Cart", 2771, 0, 0.0, 138.5431252255505, 132, 545, 135.0, 143.0, 155.0, 186.0, 0.44221618131406026, 0.7989268091225958, 0.1520118123267082], "isController": false}, {"data": ["Load_Cart", 4188, 0, 0.0, 696.4061604584524, 299, 5724, 549.5, 1222.1, 1529.0999999999995, 2406.419999999993, 0.6680223841731652, 0.4297835416762704, 0.32359515016227614], "isController": false}, {"data": ["TR_Open_Category", 2789, 0, 0.0, 1243.143420580857, 826, 3455, 1026.0, 1963.0, 2286.0, 2902.999999999999, 0.44361161890246764, 1.9390372195357395, 0.4929980686630939], "isController": true}, {"data": ["Get_Service_Properties", 6120, 0, 0.0, 137.86290849673208, 131, 467, 135.0, 141.0, 151.0, 179.0, 0.9715007400549756, 1.2390429360466777, 0.3984671004131735], "isController": false}, {"data": ["TR_Purchase", 1412, 1, 0.0708215297450425, 965.3066572237955, 535, 3007, 768.0, 1651.9000000000003, 1974.7499999999995, 2596.0, 0.22573341778619466, 0.207029971057123, 0.5336581182957415], "isController": true}, {"data": ["SC3_Buy", 994, 1, 0.1006036217303823, 11266.075452716314, 7390, 27794, 10084.5, 15607.0, 17670.25, 20237.249999999996, 0.15882001522051775, 9.609578954997852, 3.0969090031515547], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 100.0, 8.142062710166994E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 122819, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Purchase", 1413, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
