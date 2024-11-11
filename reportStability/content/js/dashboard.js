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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8004487643030329, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "TR_Open_Reg"], "isController": true}, {"data": [0.9041666666666667, 500, 1500, "Delete"], "isController": false}, {"data": [1.0, 500, 1500, "Open_Search_Page"], "isController": false}, {"data": [1.0, 500, 1500, "Get_Popular"], "isController": false}, {"data": [0.9974729241877256, 500, 1500, "Choice_Product"], "isController": false}, {"data": [0.9981617647058824, 500, 1500, "TR_Logout"], "isController": true}, {"data": [0.9996960486322188, 500, 1500, "GetAccountConfigurationRequest"], "isController": false}, {"data": [0.0, 500, 1500, "SC6_SelectFromSearch"], "isController": true}, {"data": [0.9258312020460358, 500, 1500, "Delete_From_Cart"], "isController": false}, {"data": [0.0, 500, 1500, "SC7_OpenOrders"], "isController": true}, {"data": [1.0, 500, 1500, "Get_Acc"], "isController": false}, {"data": [0.5, 500, 1500, "Get_All_Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Clear_Cart"], "isController": false}, {"data": [0.9258312020460358, 500, 1500, "TR_Delete_From_Cart"], "isController": true}, {"data": [1.0, 500, 1500, "Open_Category_Page"], "isController": false}, {"data": [0.5112634671890304, 500, 1500, "Add_Cart"], "isController": false}, {"data": [0.9531722054380665, 500, 1500, "Get_Orders_Data"], "isController": false}, {"data": [0.5443196004993758, 500, 1500, "TR_Open_Cart"], "isController": true}, {"data": [1.0, 500, 1500, "Load_Home"], "isController": false}, {"data": [0.9992181391712275, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Get_Countries"], "isController": false}, {"data": [0.955325232308792, 500, 1500, "Get_User_Cart"], "isController": false}, {"data": [0.0, 500, 1500, "SC5_RemoveFromCart"], "isController": true}, {"data": [0.9901736745886655, 500, 1500, "Load_Category"], "isController": false}, {"data": [0.9996960486322188, 500, 1500, "Get_DealOfDay"], "isController": false}, {"data": [1.0, 500, 1500, "TR_Reg"], "isController": true}, {"data": [0.7654028436018957, 500, 1500, "TR_OpenOrders"], "isController": true}, {"data": [1.0, 500, 1500, "GetAccountPaymentPreferences"], "isController": false}, {"data": [0.0, 500, 1500, "SC1_Add_To_Cart"], "isController": true}, {"data": [1.0, 500, 1500, "GetCountries"], "isController": false}, {"data": [0.9996960486322188, 500, 1500, "Get_App_Config"], "isController": false}, {"data": [1.0, 500, 1500, "Create_Acc"], "isController": false}, {"data": [0.37083333333333335, 500, 1500, "TR_Delete_Order"], "isController": true}, {"data": [0.0, 500, 1500, "TR_Search"], "isController": true}, {"data": [0.9990881458966565, 500, 1500, "Get_Categories"], "isController": false}, {"data": [0.5112634671890304, 500, 1500, "TR_Add_Cart"], "isController": true}, {"data": [1.0, 500, 1500, "Open_Orders"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh"], "isController": false}, {"data": [1.0, 500, 1500, "Open_Reg"], "isController": false}, {"data": [1.0, 500, 1500, "Get_Acc_NewReq"], "isController": false}, {"data": [0.9981617647058824, 500, 1500, "Logout"], "isController": false}, {"data": [0.0, 500, 1500, "TR_Open_Product"], "isController": true}, {"data": [1.0, 500, 1500, "Shipping"], "isController": false}, {"data": [0.9982876712328768, 500, 1500, "Key_1"], "isController": false}, {"data": [0.9991438356164384, 500, 1500, "Key_2"], "isController": false}, {"data": [0.8517156862745098, 500, 1500, "Purchase"], "isController": false}, {"data": [0.9991438356164384, 500, 1500, "Key_3"], "isController": false}, {"data": [0.9962640099626401, 500, 1500, "Load_Attributes"], "isController": false}, {"data": [0.9936170212765958, 500, 1500, "Pre_Load_Home"], "isController": false}, {"data": [0.0, 500, 1500, "TR_Open_Home"], "isController": true}, {"data": [0.0, 500, 1500, "SC2_Register"], "isController": true}, {"data": [1.0, 500, 1500, "Open_Payment-page"], "isController": false}, {"data": [0.7462861610633307, 500, 1500, "TR_Login"], "isController": true}, {"data": [0.9996389891696751, 500, 1500, "Open_Product"], "isController": false}, {"data": [0.0, 500, 1500, "SC4_RemoveOrder"], "isController": true}, {"data": [0.35171568627450983, 500, 1500, "TR_Shipping_Details"], "isController": true}, {"data": [1.0, 500, 1500, "Open_Cart"], "isController": false}, {"data": [0.825889164598842, 500, 1500, "Load_Cart"], "isController": false}, {"data": [0.5, 500, 1500, "TR_Open_Category"], "isController": true}, {"data": [1.0, 500, 1500, "Get_Service_Properties"], "isController": false}, {"data": [0.5, 500, 1500, "TR_Purchase"], "isController": true}, {"data": [0.0, 500, 1500, "SC3_Buy"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35452, 0, 0.0, 303.4011621347176, 132, 2171, 227.0, 535.0, 756.0, 890.9900000000016, 6.492272159740807, 15.119306161017855, 3.6064280229504897], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TR_Open_Reg", 165, 0, 0.0, 282.8060606060603, 271, 385, 278.0, 298.4, 304.7, 349.3600000000002, 0.030390540548256403, 0.201270959745703, 0.04395350639840599], "isController": true}, {"data": ["Delete", 120, 0, 0.0, 383.4083333333333, 209, 891, 362.5, 531.8, 568.75, 848.9999999999984, 0.02220875713502591, 0.02978843533106039, 0.01420651974154929], "isController": false}, {"data": ["Open_Search_Page", 584, 0, 0.0, 137.48972602739738, 132, 227, 135.0, 144.0, 154.0, 186.44999999999993, 0.1071400200814154, 0.11331312670720009, 0.03662012405126503], "isController": false}, {"data": ["Get_Popular", 1644, 0, 0.0, 138.20620437956208, 132, 495, 135.0, 141.0, 155.0, 195.0999999999999, 0.3016106448743803, 0.26273114768354217, 0.1369618651040887], "isController": false}, {"data": ["Choice_Product", 1385, 0, 0.0, 345.3357400722022, 269, 741, 356.0, 384.0, 393.0, 426.5600000000004, 0.25445694661952567, 0.2135422417592694, 0.09686961231049847], "isController": false}, {"data": ["TR_Logout", 544, 0, 0.0, 254.4485294117648, 177, 677, 205.0, 369.0, 379.75, 413.0999999999999, 0.09998764858458661, 0.10506514636427265, 0.11112123994058087], "isController": true}, {"data": ["GetAccountConfigurationRequest", 1645, 0, 0.0, 152.37325227963532, 140, 546, 146.0, 166.0, 174.0, 210.0, 0.30136776999025544, 0.44057378093301997, 0.31490577528278646], "isController": false}, {"data": ["SC6_SelectFromSearch", 363, 0, 0.0, 5647.258953168044, 5278, 6667, 5614.0, 5879.2, 5968.0, 6415.04, 0.06689610371660377, 3.3554666443794834, 0.5081099863858136], "isController": true}, {"data": ["Delete_From_Cart", 391, 0, 0.0, 326.6061381074168, 179, 1648, 234.0, 568.6000000000001, 732.0, 1328.6799999999964, 0.07221474115263223, 0.04216434447484277, 0.046042524832359294], "isController": false}, {"data": ["SC7_OpenOrders", 91, 0, 0.0, 3051.1208791208796, 2664, 3646, 3048.0, 3396.4, 3452.7999999999997, 3646.0, 0.016955048440200758, 0.4746092589143962, 0.13021529604353013], "isController": true}, {"data": ["Get_Acc", 408, 0, 0.0, 167.83088235294116, 150, 391, 158.0, 205.20000000000005, 214.54999999999995, 239.54999999999984, 0.07541223042207006, 0.14476014006851423, 0.08395718817181345], "isController": false}, {"data": ["Get_All_Categories", 1969, 0, 0.0, 784.3930929405792, 690, 1434, 772.0, 857.0, 891.0, 974.8999999999999, 0.36119042788500166, 3.3792820338212923, 0.1387106844265107], "isController": false}, {"data": ["Clear_Cart", 408, 0, 0.0, 196.1078431372549, 176, 323, 186.0, 234.0, 243.54999999999995, 278.3699999999998, 0.07541563162717173, 0.03100800685727721, 0.05096663593048379], "isController": false}, {"data": ["TR_Delete_From_Cart", 391, 0, 0.0, 326.6061381074168, 179, 1648, 234.0, 568.6000000000001, 732.0, 1328.6799999999964, 0.07221474115263223, 0.04216434447484277, 0.046042524832359294], "isController": true}, {"data": ["Open_Category_Page", 803, 0, 0.0, 138.63387297633867, 132, 443, 135.0, 143.0, 158.0, 194.80000000000018, 0.1476700136084446, 0.1558899264753209, 0.050905776175567324], "isController": false}, {"data": ["Add_Cart", 1021, 0, 0.0, 735.9627815866802, 483, 2171, 683.0, 983.6000000000001, 1110.6, 1587.8399999999992, 0.18786021874951703, 0.11473840148295496, 0.14089085164893803], "isController": false}, {"data": ["Get_Orders_Data", 331, 0, 0.0, 345.1691842900299, 169, 838, 331.0, 497.8, 538.4, 670.5600000000002, 0.0607740781481202, 0.07485949781332664, 0.027656953532250013], "isController": false}, {"data": ["TR_Open_Cart", 801, 0, 0.0, 648.4906367041207, 435, 2270, 572.0, 894.6000000000001, 1015.8, 1453.780000000001, 0.147638285095611, 0.3621472685097123, 0.12226727478526095], "isController": true}, {"data": ["Load_Home", 1644, 0, 0.0, 138.25, 132, 417, 135.0, 142.0, 155.0, 194.54999999999995, 0.3016093721993579, 0.7743479723993484, 0.1269469134940657], "isController": false}, {"data": ["Login", 1279, 0, 0.0, 232.79437060203298, 181, 743, 210.0, 317.0, 332.0, 366.4000000000001, 0.2346991391918202, 0.33832852471910424, 0.26044802688259355], "isController": false}, {"data": ["Get_Countries", 408, 0, 0.0, 145.078431372549, 136, 461, 139.0, 157.10000000000002, 170.54999999999995, 224.81999999999994, 0.07541407038018118, 0.3628966395407061, 0.07541407038018118], "isController": false}, {"data": ["Get_User_Cart", 1399, 0, 0.0, 275.5546819156538, 164, 1565, 212.0, 471.0, 601.0, 1044.0, 0.25664422359710637, 0.13737897769882773, 0.12038886696299077], "isController": false}, {"data": ["SC5_RemoveFromCart", 391, 0, 0.0, 6803.657289002557, 5780, 12098, 6520.0, 7832.2, 8329.799999999997, 11020.279999999992, 0.07212337487221619, 3.4098972381981443, 0.7628538775006614], "isController": true}, {"data": ["Load_Category", 2188, 0, 0.0, 435.84140767824493, 392, 706, 431.0, 461.0, 476.0, 522.0, 0.4018515290836371, 0.9732973056663087, 0.15324711170361358], "isController": false}, {"data": ["Get_DealOfDay", 1645, 0, 0.0, 368.58784194528903, 339, 692, 366.0, 387.0, 397.0, 427.0799999999999, 0.301357445837182, 0.2084865476990214, 0.14008412521337757], "isController": false}, {"data": ["TR_Reg", 165, 0, 0.0, 235.97575757575765, 162, 339, 241.0, 269.4, 285.8999999999999, 327.12000000000006, 0.03039138579193505, 0.03315154094686665, 0.04683827707550141], "isController": true}, {"data": ["TR_OpenOrders", 211, 0, 0.0, 489.4407582938388, 317, 966, 480.0, 639.6, 691.5999999999998, 808.0799999999999, 0.038787720138694595, 0.11694193156596137, 0.031325629447949636], "isController": true}, {"data": ["GetAccountPaymentPreferences", 408, 0, 0.0, 167.03431372549, 149, 301, 156.5, 216.10000000000002, 226.0, 240.63999999999987, 0.07541384735017366, 0.06628170177261357, 0.08697848806141496], "isController": false}, {"data": ["SC1_Add_To_Cart", 219, 0, 0.0, 6723.954337899541, 6181, 8728, 6604.0, 7188.0, 7620.0, 8673.6, 0.04026713844798313, 2.116147333104203, 0.3996515645667936], "isController": true}, {"data": ["GetCountries", 165, 0, 0.0, 143.5333333333334, 136, 247, 139.0, 156.4, 165.0, 212.02000000000018, 0.03039137459634729, 0.1462514751904158, 0.030450732749855783], "isController": false}, {"data": ["Get_App_Config", 1645, 0, 0.0, 144.67477203647422, 135, 564, 139.0, 161.0, 168.0, 203.53999999999996, 0.30136754914535274, 2.0303078542795383, 0.14185464715630863], "isController": false}, {"data": ["Create_Acc", 165, 0, 0.0, 235.97575757575765, 162, 339, 241.0, 269.4, 285.8999999999999, 327.12000000000006, 0.03039436971011324, 0.03315479586542626, 0.046842875799210745], "isController": false}, {"data": ["TR_Delete_Order", 120, 0, 0.0, 1326.4583333333333, 966, 2005, 1306.5, 1651.4, 1810.3999999999996, 1989.8799999999994, 0.022204146402299164, 0.207342962388859, 0.05987024266911603], "isController": true}, {"data": ["TR_Search", 584, 0, 0.0, 2075.686643835614, 1921, 2546, 2062.5, 2180.0, 2223.75, 2407.2999999999993, 0.10710294243326882, 1.378232204383041, 0.20615224564059845], "isController": true}, {"data": ["Get_Categories", 1645, 0, 0.0, 364.94832826747734, 329, 843, 361.0, 384.0, 394.6999999999998, 432.0, 0.3013559552425036, 1.5530386881966107, 0.13419757381892738], "isController": false}, {"data": ["TR_Add_Cart", 1021, 0, 0.0, 735.9627815866802, 483, 2171, 683.0, 983.6000000000001, 1110.6, 1587.8399999999992, 0.18786021874951703, 0.11473840148295496, 0.14089085164893803], "isController": true}, {"data": ["Open_Orders", 331, 0, 0.0, 141.0090634441089, 132, 486, 135.0, 143.0, 158.39999999999998, 409.920000000001, 0.06078009321572967, 0.10826454104051847, 0.021427357080935946], "isController": false}, {"data": ["Refresh", 120, 0, 0.0, 138.30833333333325, 133, 209, 135.0, 145.70000000000002, 156.84999999999997, 201.85999999999973, 0.022210389020516294, 0.07146799982675896, 0.008198756884526521], "isController": false}, {"data": ["Open_Reg", 165, 0, 0.0, 139.27272727272725, 134, 184, 138.0, 143.0, 151.39999999999998, 179.38000000000002, 0.03039132421630445, 0.05502491708694185, 0.013503957537518091], "isController": false}, {"data": ["Get_Acc_NewReq", 408, 0, 0.0, 164.30392156862754, 148, 234, 155.0, 203.0, 210.54999999999995, 224.90999999999997, 0.07541227223830278, 0.13997330852630002, 0.0837363003349192], "isController": false}, {"data": ["Logout", 544, 0, 0.0, 254.4485294117648, 177, 677, 205.0, 369.0, 379.75, 413.0999999999999, 0.09998764858458661, 0.10506514636427265, 0.11112123994058087], "isController": false}, {"data": ["TR_Open_Product", 1385, 0, 0.0, 1698.85848375451, 1522, 2448, 1686.0, 1802.4, 1848.0, 2035.4200000000003, 0.25439095315973764, 3.8895480601220416, 0.3788110241536404], "isController": true}, {"data": ["Shipping", 408, 0, 0.0, 173.4509803921569, 151, 268, 167.0, 197.0, 212.54999999999995, 232.81999999999994, 0.07541354068606729, 0.04395838015873441, 0.06556266137434894], "isController": false}, {"data": ["Key_1", 584, 0, 0.0, 384.01883561643825, 344, 770, 381.0, 402.0, 412.0, 445.0, 0.10713630526508898, 0.12608674153824986, 0.04310562282150064], "isController": false}, {"data": ["Key_2", 584, 0, 0.0, 380.06335616438315, 351, 670, 377.5, 399.0, 408.0, 434.7499999999999, 0.10713640353733585, 0.07083461654707077, 0.0432102877548044], "isController": false}, {"data": ["Purchase", 408, 0, 0.0, 484.0686274509804, 348, 693, 479.0, 573.0, 611.5999999999995, 683.91, 0.07541128259990008, 0.038104364883128225, 0.12735725815573945], "isController": false}, {"data": ["Key_3", 584, 0, 0.0, 381.45376712328755, 344, 504, 379.0, 402.0, 412.75, 426.89999999999986, 0.10713654111878435, 0.06599900158008053, 0.04331496877263351], "isController": false}, {"data": ["Load_Attributes", 803, 0, 0.0, 373.56787048567867, 335, 713, 368.0, 394.0, 406.0, 484.0000000000009, 0.14766390371504362, 0.1311193445115644, 0.05551816692411308], "isController": false}, {"data": ["Pre_Load_Home", 1645, 0, 0.0, 388.1702127659582, 364, 1441, 373.0, 406.4000000000001, 433.0, 583.0799999999981, 0.3013499930112449, 0.9696760029023943, 0.1418463834291211], "isController": false}, {"data": ["TR_Open_Home", 1644, 0, 0.0, 1833.230535279804, 1737, 2903, 1811.0, 1897.0, 1970.75, 2205.1499999999996, 0.3015027270041358, 6.625784338070386, 1.2607760517887787], "isController": true}, {"data": ["SC2_Register", 165, 0, 0.0, 3224.1575757575747, 2743, 4316, 3245.0, 3375.4, 3464.5, 3982.040000000002, 0.03037406489299309, 0.9924632222998654, 0.2993659278765988], "isController": true}, {"data": ["Open_Payment-page", 408, 0, 0.0, 139.47794117647052, 132, 456, 135.0, 144.0, 162.0, 220.00999999999965, 0.07541409825902488, 0.09566690785007159, 0.02673370866018167], "isController": false}, {"data": ["TR_Login", 1279, 0, 0.0, 516.7865519937455, 348, 1784, 502.0, 730.0, 862.0, 1277.4000000000035, 0.23469181789823293, 0.4648573330297998, 0.3705163816356864], "isController": true}, {"data": ["Open_Product", 1385, 0, 0.0, 138.39061371841177, 132, 504, 135.0, 141.0, 154.0, 187.0, 0.2544676527517875, 0.6821422918004459, 0.08747325563342695], "isController": false}, {"data": ["SC4_RemoveOrder", 120, 0, 0.0, 10415.73333333333, 8989, 13572, 10286.0, 11579.8, 12082.199999999997, 13322.30999999999, 0.02216370184058462, 1.59752402389441, 0.48523139620424444], "isController": true}, {"data": ["TR_Shipping_Details", 408, 0, 0.0, 1442.6299019607839, 1206, 2349, 1368.0, 1689.3000000000002, 1792.0, 2018.1499999999978, 0.07539710992529033, 0.9020733128210383, 0.45881481668246066], "isController": true}, {"data": ["Open_Cart", 801, 0, 0.0, 139.19225967540564, 132, 480, 135.0, 146.0, 160.0, 203.9000000000001, 0.14764846320253755, 0.266747711840522, 0.050754159225872286], "isController": false}, {"data": ["Load_Cart", 1209, 0, 0.0, 501.2514474772544, 302, 2133, 430.0, 729.0, 843.5, 1229.500000000005, 0.22284539469439954, 0.14401602514595543, 0.10794721812822403], "isController": false}, {"data": ["TR_Open_Category", 803, 0, 0.0, 950.8318804483179, 882, 1363, 942.0, 992.0, 1032.8, 1197.92, 0.14763808481596535, 0.646558508612191, 0.16407435597711775], "isController": true}, {"data": ["Get_Service_Properties", 1765, 0, 0.0, 138.0929178470258, 132, 433, 135.0, 143.0, 153.0, 191.33999999999992, 0.32335222272134695, 0.41240039343171786, 0.13262493510055245], "isController": false}, {"data": ["TR_Purchase", 408, 0, 0.0, 680.1764705882358, 527, 980, 667.0, 800.1, 857.9499999999996, 923.91, 0.0754086343995338, 0.06910815664748367, 0.17831469291497068], "isController": true}, {"data": ["SC3_Buy", 288, 0, 0.0, 8608.840277777772, 7635, 11814, 8402.5, 9499.4, 9881.95, 10901.920000000004, 0.05314419903388275, 3.224199621605922, 1.036335127422905], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35452, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
