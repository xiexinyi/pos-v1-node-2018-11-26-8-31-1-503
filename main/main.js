const database = require('../main/datbase');

module.exports = function printInventory(inputs) {
    let result = '***<没钱赚商店>购物清单***\n';
    let cutline = '----------------------\n';
    let ending = '**********************';

    let allItems = database.loadAllItems();
    let allPromotions = database.loadPromotions();
    let countedItems = new Array();

    for (var i = 0; i < inputs.length; i++){
        let barcode = inputs[i].split('-')[0];
        let count = inputs[i].split('-')[1];
        if (!(barcode in countedItems)){
            if (count != undefined){
                countedItems[barcode] = parseInt(count);
            }else{
                countedItems[barcode] = 1;
            }
        }else{
            if (count != undefined){
                countedItems[barcode] += parseInt(count);
            }else{
                countedItems[barcode] += 1;
            }
        }
    }

    let promotedItems = cutline + '挥泪赠送商品：\n';
    let saved = 0;
    let finalPrice = 0;
    for (var key in countedItems){
        for (i = 0; i < allItems.length; i++){
            if (key == allItems[i].barcode){
                result += '名称：' + allItems[i].name + '，数量：' + countedItems[key] + allItems[i].unit + '，单价：' + allItems[i].price.toFixed(2) + '(元)，小计：';
                if (countedItems[key] >= 2){
                    if (allPromotions[0].barcodes.indexOf(key) != -1){
                        promotedItems += '名称：' + allItems[i].name + '，数量：1' + allItems[i].unit + '\n';
                        result += (allItems[i].price * (countedItems[key] - 1)).toFixed(2) + '(元)\n';
                        saved += allItems[i].price;
                        finalPrice += allItems[i].price * (countedItems[key] - 1);
                    }else{
                        result += (allItems[i].price * countedItems[key]).toFixed(2) + '(元)\n';
                        finalPrice += allItems[i].price * countedItems[key];
                    }
                }else{
                    result += allItems[i].price.toFixed(2) + '(元)\n';
                    finalPrice += allItems[i].price;
                }
                break;
            }
        }
    }

    if (saved != 0){
        result += promotedItems;
    }
    result += cutline + '总计：' + finalPrice.toFixed(2) + '(元)\n';
    if (saved != 0){
        result += '节省：' + saved.toFixed(2) + '(元)\n';
    }
    result += ending;

    console.log(result);m
    return result;
};