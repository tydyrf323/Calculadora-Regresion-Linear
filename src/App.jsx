import { useState, useRef, useEffect } from "react";
import Chart from 'chart.js/auto'
function App() {
  const chartRef = useRef(null)
  const chartIns = useRef(null)
  const [main, setMain] = useState(0)
  const [mainX, setMainX] = useState(0)
  const [mainY, setMainY] = useState(0)
  useEffect(() => {
    if (chartIns.current) {
      chartIns.current.destroy()
    }
    const mainchartref = chartRef.current.getContext('2d')
    chartIns.current = new Chart(mainchartref, {
      type: "line",
      data: {
        datasets: [{
          label: 'Scatter',
          data: [{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 2 }, { x: 4, y: 5 }],
          borderColor: 'rgba(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192)',
          type: 'scatter',
          showLine: false // No mostrar línea de conexión
        }, {
          label: 'Line',
          data: [{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 2 }, { x: 4, y: 5 }],
          borderColor: 'rgba(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132)',
          type: 'line', // Tipo de gráfico de línea
          fill: false // No rellenar área bajo la línea
        }]
      }
    })
    return () => {
      if (chartIns.current) {
        chartIns.current.destroy()
      }
    }
  }, [])

  function onsub(e) {
    e.preventDefault();
    var regressor = {};
    const x = e.target[0].value
    const y = e.target[1].value
    const valorx = e.target[2].value
    const arrayDeNumerosX = x.split(',').map(Number);
    const arrayDeNumerosY = y.split(',').map(Number);
    const x_mean = arrayDeNumerosX.reduce((a, b) => a + b, 0) / arrayDeNumerosX.length;
    const y_mean = arrayDeNumerosY.reduce((a, b) => a + b, 0) / arrayDeNumerosY.length;
    let slope = 0, slope_numerator = 0, slope_denominator = 0;
    for (let i = 0; i < arrayDeNumerosX.length; i++) {
      slope_numerator += (arrayDeNumerosX[i] - x_mean) * (arrayDeNumerosY[i] - y_mean);
      slope_denominator += Math.pow((arrayDeNumerosX[i] - x_mean), 2);
    }
    slope = slope_numerator / slope_denominator;
    regressor['slope'] = slope;
    const intercept = y_mean - x_mean * slope;
    regressor['intercept'] = intercept;
    let y_hat = [];
    for (let i = 0; i < arrayDeNumerosX.length; i++) {
      y_hat.push(arrayDeNumerosX[i] * regressor['slope'] + regressor['intercept']);
    }
    setMain(regressor['slope'] * valorx + regressor['intercept'])
    setMainX(x_mean)
    setMainY(y_mean)
    regressor['y_hat'] = y_hat;
    let residual_sum_of_squares = 0, total_sum_of_squares = 0, r2 = 0;
    for (let i = 0; i < arrayDeNumerosY.length; i++) {
      residual_sum_of_squares += Math.pow((y_hat[i] - arrayDeNumerosY[i]), 2);
      total_sum_of_squares += Math.pow((y_hat[i] - y_mean), 2);
    }
    r2 = 1 - residual_sum_of_squares / total_sum_of_squares;
    regressor['r2'] = r2;
    chartIns.current.data = {
      datasets: [{
        label: 'Dispersion',
        data: arrayDeNumerosY,
        borderColor: 'rgba(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192)',
        type: 'scatter',
        showLine: false
      },
      {
        label: 'Ecuacion de Regresion',
        data: y_hat,
        borderColor: 'rgba(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132)',
        type: 'line',
        fill: false
      }],
      labels: arrayDeNumerosX
    };
    chartIns.current.update()
  }

  return (
    <main>
      <h1>DATOS:</h1>
      <form onSubmit={onsub}>
        <span>X:</span> <input type="text" name="" id="" />
        <span>Y:</span> <input type="text" name="" id="" />
        <span>Valor X:</span> <input type="number" name="" id="" />
        <span>= {main}</span>
        <button type="submit">Agregar</button>
        <br />
        <span>Media de X = {mainX} ; Media de Y = {mainY}</span>
      </form>
      <div>
        <canvas ref={chartRef} style={{ width: "300px", height: "200px" }} />
      </div>
    </main>
  );
}

export default App;
