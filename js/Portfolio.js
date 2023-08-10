const Money = require('./Money');

class Portfolio{
    constructor(){
        this.moneys=[]
    }
    add(...moneys){
        this.moneys = this.moneys.concat(moneys)
    }
    evaluate(currency){
        let failures = []
        let total = this.moneys.reduce((sum,money) => {
            let convertedAmount = this.convert(money,currency)
            if(convertedAmount===undefined){
                failures.push(money.currency+"->"+currency)
                return sum;
            }
            return sum + convertedAmount
        },0)
        if(!failures.length){
            return new Money(total,currency);
        }
        throw new Error("Missing exchange rate(s):["+failures.join()+"]")
        // failures.join() 是一个数组方法，用于将数组中的所有元素连接成一个字符串，默认使用逗号 , 分隔元素
    }
    convert(money, currency){
        let exchangeRates = new Map();
        exchangeRates.set("EUR->USD", 1.2)
        exchangeRates.set("USD->KRW", 1100)
        
        if(money.currency===currency){
            return money.amount;
        }
        let key = money.currency+"->"+currency;
        let rate = exchangeRates.get(key)
        if(rate===undefined){
            return undefined
        }
        return money.amount*rate;
    }
}

module.exports = Portfolio;