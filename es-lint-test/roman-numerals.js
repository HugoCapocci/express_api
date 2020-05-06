// eslint-disable-next-line eslint no-use-before-define
const refs = [
    { numeric: 100, roman: 'C'},
    { numeric: 90, roman: 'XC'},
    { numeric: 50, roman: 'L'},
    { numeric: 40, roman: 'XL'},
    { numeric: 10, roman: 'X'},
    { numeric: 9, roman: 'IX'},
    { numeric: 5, roman: 'V'},
    { numeric: 4, roman: 'IV'},
    { numeric: 1, roman: 'I'},
];
    function decimalToRoman(number) {
        // eslint-disable-next-line no-unused-vars
        let romanNum = '';
        for (const ref of refs){
          /*  if (number === ref.numeric){
                return ref.roman;
            }*/
          if (ref.numeric> number) continue;
          //nombre d'occurence du ref.numeric parmi le nombre restant
            const occurences = Math.floor(number/ref.numeric);
            //on ajoute autant de fois, le ref.roman que d'occurence pour cette ref
            romanNum += ref.roman.repeat(occurences);
            //on retire du nmbre initial la ref en question (*occurence)
            number-=occurences * ref.numeric;
        }
    return romanNum;
}


module.exports = decimalToRoman;