const assert = require('assert');
const Money = require('./Money');
const Portfolio = require('./Portfolio');
const { type } = require('os');


class MoneyTest{
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
        assert.deepStrictEqual(portfolio.evaluate("USD"),fifteenDollars)
    }
    testAdditionOfDollarsAndEuros(){
        let fiveDollars = new Money(5,"USD")
        let tenEuros = new Money(10,"EUR")
        let portfolio = new Portfolio()
        portfolio.add(fiveDollars,tenEuros)
        let expectedValue = new Money(17,"USD")
        assert.deepStrictEqual(portfolio.evaluate("USD"),expectedValue)
    }
    // 一個接一個測試所有方法
    runAllTests(){
        let testMethods = this.getAllTestMethods();
        
        // 遍歷testMethods array裡的每個element，並且當前element叫做m
        testMethods.forEach(m => {
            console.log("Running:%s()",m)
            let method = Reflect.get(this,m);//在this物件上取出當前的method給method變數
            try{
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






