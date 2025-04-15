import React, { useCallback, useEffect, useState } from "react";

function App() {
    const [expression, setExpression] = useState(0);        // строка полного выражения
    const [res, setRes] = useState(0)                     // Конечный результат вычислений
    const [prevNum, setPrevNum] = useState(0)                // Массив всех ранее введенных чисел
    const [curNum, setCurNum] = useState(0)                // текущее число в виде строки
    const [functionType, setFunctionType] = useState('');   // знак текущего выражения

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            if (key >= 0 || key <= 9) {
                if(expression === 0) {
                    setCurNum(curNum ? curNum + key : key)
                    setExpression(key)
                    return
                }
                setCurNum(curNum + key)
                setExpression(expression + key)
            }            
        };
    
        window.addEventListener("keydown", handleKeyDown);
    
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
      }, [curNum]);


    function handleClickReset() {
        setPrevNum(0)
        setCurNum(0)
        setExpression(0)
        setRes(0)
        setFunctionType('')
    }

    function handleClickNumber(num) {
        if(expression === 0) {
            setCurNum(curNum ? curNum + num.target.innerText : num.target.innerText)
            setExpression(num.target.innerText)
            return false
        }
        setCurNum(curNum + num.target.innerText)
        setExpression(expression + num.target.innerText)
    }

    function handleClickZero(zero) {
        if(expression === 0) return false
        setCurNum(curNum + zero.target.innerText)
        setExpression(expression + zero.target.innerText)
    }

    function handleClickDot(dot) {
        if(!curNum) {
            setCurNum(0 + curNum + dot.target.innerText)
            setExpression(expression + 0 + dot.target.innerText)
            return false
        }
        if(curNum.includes('.')) return false
        setCurNum(curNum + dot.target.innerText)
        setExpression(expression + dot.target.innerText)
    }

    function handleClickBackspace () {
        if(!curNum) {
            if(!expression) setExpression(0)
            return
        }
        else {
            const newCurNum = curNum.slice(0, curNum.length - 1)
            setCurNum(newCurNum)
            setExpression(expression.slice(0, expression.length - 1))
        }
    }

    const handleClickOperator = useCallback((e) => {
        const operator = e.target.innerText
        setFunctionType(operator)
        if(expression === 0) return
        if(curNum.length === 0) {
            setExpression(prevExpression => prevExpression.replace(/..$/, operator) + " ");
            return
        }
        const newExpression = expression + " " + operator + " "
        setExpression(newExpression);
        let result;
        switch (functionType) {
            case "+":
                result = Math.round(`${(parseFloat(prevNum) + parseFloat(curNum)) * 10000}`) / 10000;
                break;
            case "-":
                result = Math.round(`${(parseFloat(prevNum) - parseFloat(curNum)) * 10000}`) / 10000;
                break;
            case "*":
                result = Math.round(`${(parseFloat(prevNum) * parseFloat(curNum)) * 10000}`) / 10000;
                break;
            case "/":
                result = Math.round(`${(parseFloat(prevNum) / parseFloat(curNum)) * 10000}`) / 10000;
                break;
            default:
                break;
        }
        setCurNum(0)
        setPrevNum(result || curNum)
        setRes(result)
    }, [curNum, expression, functionType, prevNum]);

    function handleClickEqually() {
        try {
            const result = eval(expression);
            // setExpression(result.toString());
            setCurNum(0)
            setPrevNum(result.toString() || curNum.toString())
            setRes(result.toString());
        } catch (error) {
            const reserve = expression
            setExpression('Error');
            setTimeout(() => setExpression(reserve), 1500)
        } 
    }

    return (
        <div className='desktop'>
            <div className='calc'>
                <div className='screen'>
                    <h3 className='expression'>{expression}</h3>
                    <h1 className='result'> {!res ? 0 : res} </h1>
                </div>
                <div className='keyboard'>
                    <ul>
                        <li onClick={handleClickReset} className='reset'>C</li>
                        <li onClick={handleClickBackspace} className='backspace'><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff6b6b" d="M9 19q-.5 0-.937-.225t-.713-.625l-3.525-5Q3.45 12.625 3.45 12t.375-1.15l3.525-5q.275-.4.713-.625T9 5h10q.825 0 1.413.588T21 7v10q0 .825-.587 1.413T19 19H9Zm10-2V7v10ZM9 17h10V7H9l-3.55 5L9 17Zm5-3.6l1.9 1.9q.275.275.7.275t.7-.275q.275-.275.275-.7t-.275-.7L15.4 12l1.9-1.9q.275-.275.275-.7t-.275-.7q-.275-.275-.7-.275t-.7.275L14 10.6l-1.9-1.9q-.275-.275-.7-.275t-.7.275q-.275.275-.275.7t.275.7l1.9 1.9l-1.9 1.9q-.275.275-.275.7t.275.7q.275.275.7.275t.7-.275l1.9-1.9Z"/></svg></li>
                        <li onClick={(e) => handleClickOperator(e)} className='percent'> % </li>
                        <li onClick={(e) => handleClickOperator(e)} className='divide'> / </li>
                        <li onClick={(e) => handleClickNumber(e)} onKeyDown={(event) => handleClickNumber(event.code)} className='seven numeral'>7</li>
                        <li onClick={(e) => handleClickNumber(e)} className='eight numeral'>8</li>
                        <li onClick={(e) => handleClickNumber(e)} className='nine numeral'>9</li>
                        <li onClick={(e) => handleClickOperator(e)} className='multiply'> * </li>
                        <li onClick={(e) => handleClickNumber(e)} className='four numeral'>4</li>
                        <li onClick={(e) => handleClickNumber(e)} className='five numeral'>5</li>
                        <li onClick={(e) => handleClickNumber(e)} className='six numeral'>6</li>
                        <li onClick={(e) => handleClickOperator(e)} className='minus'> - </li>
                        <li onClick={(e) => handleClickNumber(e)} className='one numeral'>1</li>
                        <li onClick={(e) => handleClickNumber(e)} className='two numeral'>2</li>
                        <li onClick={(e) => handleClickNumber(e)} className='three numeral'>3</li>
                        <li onClick={(e) => handleClickOperator(e)} className='plus'> + </li>
                        <li onClick={(e) => handleClickZero(e)} className='zero numeral'>0</li>
                        <li onClick={(e) => handleClickDot(e)} className='dot'>.</li>
                        <li onClick={handleClickEqually} className='equally'>=</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
