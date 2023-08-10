const Money = require('./Money');

class Portfolio{
    constructor(){
        this.moneys=[]
    }
    add(...moneys){
        this.moneys = this.moneys.concat(moneys)
    }
    evaluate(bank, currency){
        let failures = []
        let total = this.moneys.reduce((sum,money) => {
            try {
                let convertedMoney = bank.convert(money,currency)
                return sum+convertedMoney.amount
            } catch (error) {
                failures.push(error.message)
                return sum
            }
        },0)
        if(!failures.length){
            return new Money(total,currency);
        }
        throw new Error("Missing exchange rate(s):["+failures.join()+"]")
        // failures.join() 是一个数组方法，用于将数组中的所有元素连接成一个字符串，默认使用逗号 , 分隔元素
    }
    
}

module.exports = Portfolio;