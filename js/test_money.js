const assert = require('assert');
const Money = require('./Money');
const Portfolio = require('./Portfolio');
const Bank = require('./bank');
const { type } = require('os');


class MoneyTest{
    setUp(){
        this.bank = new Bank();
        this.bank.addExchangeRate("EUR","USD",1.2)
        this.bank.addExchangeRate("USD","KRW",1100)
    }
    testMultiplication(){
        let tenEuros = new Money(10,"EUR");
        let twentyEuros = new Money(20,"EUR");
        assert.deepStrictEqual(tenEuros.times(2),twentyEuros);
    }
    testDivision(){
        let originalMoney = new Money(4002,"KRW");
        let expectedMoneyAfterDivision = new Money(1000.5,"KRW")
        assert.deepStrictEqual(originalMoney.divide(4),expectedMoneyAfterDivision)
    }
    testAddition(){
        let fiveDollars = new Money(5,"USD")
        let tenDollars = new Money(10,"USD")
        let fifteenDollars = new Money(15,"USD")
        let portfolio = new Portfolio();
        portfolio.add(fiveDollars,tenDollars)
        assert.deepStrictEqual(portfolio.evaluate(new Bank, "USD"),fifteenDollars)
    }
    testAdditionOfDollarsAndEuros(){
        let fiveDollars = new Money(5,"USD")
        let tenEuros = new Money(10,"EUR")
        let portfolio = new Portfolio()
        portfolio.add(fiveDollars,tenEuros)
        let expectedValue = new Money(17,"USD")
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "USD"),expectedValue)
    }
    testAdditionOfDollarsAndWons(){
        let oneDollar = new Money(1,"USD")
        let elevenHundredWon = new Money(1100,"KRW")
        let portfolio = new Portfolio()
        portfolio.add(oneDollar,elevenHundredWon)
        let expectedValue = new Money(2200,"KRW")
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "KRW"),expectedValue)
    }
    testAdditionWithMultipleMissingExchangeRates(){
        let oneDollar = new Money(1,"USD")
        let oneEuro = new Money(1,"EUR")
        let oneWon = new Money(1,"KRW")
        let portfolio = new Portfolio()
        portfolio.add(oneDollar,oneEuro,oneWon)
        let expectedError = new Error(
            "Missing exchange rate(s):[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]"
        )
        assert.throws(()=>portfolio.evaluate(this.bank, "Kalganid"), expectedError)
        // 表示测试代码中的函数应该抛出一个与 expectedError 匹配的错误，否则测试将失败。
    }
    testConversionWithDifferentRatesBetweenTwoCurrencies(){
        // let bank = new Bank()
        let tenEuros = new Money(10,"EUR")
        assert.deepStrictEqual(this.bank.convert(tenEuros,"USD"), new Money(12,"USD"));

        this.bank.addExchangeRate("EUR","USD",1.3)
        assert.deepStrictEqual(this.bank.convert(tenEuros, "USD"), new Money(13,"USD"))
        

    }
    testConversionWithMissingExchange(){
        let bank = new Bank()
        let tenEuros = new Money(10,"EUR")
        let expectedError = new Error("EUR->Kalganid")
        assert.throws(function(){bank.convert(tenEuros, "Kalganid")},
            expectedError)
    }
    
    // 一個接一個測試所有方法
    runAllTests(){
        let testMethods = this.getAllTestMethods();
        
        // 遍歷testMethods array裡的每個element，並且當前element叫做m
        testMethods.forEach(m => {
            console.log("Running:%s()",m)
            let method = Reflect.get(this,m);//在this物件上取出當前的method給method變數
            try{
                this.setUp() //讓每次測試前都有一個新的Bank物件
                Reflect.apply(method,this,[]);//在this物件上呼叫當前的method，[]表示method不需要任何參數
            }catch(e){
                if(e instanceof assert.AssertionError){
                    console.log(e)
                }
                else{
                    throw e;
                }
            }
            
        })
    }
    // 自動找到所有的測試:
    getAllTestMethods(){
        let moneyPrototype = MoneyTest.prototype
        let allProps = Object.getOwnPropertyNames(moneyPrototype)
        let testMethods = allProps.filter(p => {
            return typeof moneyPrototype[p] === 'function'&& p.startsWith("test");
        });
        return testMethods;
    }
}

new MoneyTest().runAllTests();






