import reduce from "lodash/reduce";

export const computeTotals = (laborItems, materialItems, offset) => {
    if (!offset) {
        offset = 0;
    }
    const totals = {
        labor: 0,
        materials: 0,
        grandTotal: 0,
        total: 0
    };

    totals.labor = reduce(laborItems, (sum, laborItem) => {
        return laborItem.cost.toFixed(2)*1 + sum;
    }, 0);

    totals.materials = reduce(materialItems, (sum, materialItem) => {
        return (materialItem.unitCost.toFixed(2)*1 * materialItem.quantity) + sum;
    }, 0);

    totals.grandTotal = totals.labor + totals.materials;
    totals.total = totals.grandTotal + offset;

    return totals;
};

export const currencyFormatter = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return "$" + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};