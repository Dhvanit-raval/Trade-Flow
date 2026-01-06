import React, { useState, useEffect } from "react";
import { holdings } from "../data/data";
import axios from "axios";
import { VerticleGraph } from "./VerticleGrapg";


const Holdings = () => {

  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => { // To fetch the data comming from api end-point in json response and with the help of axios we get it.
    axios.get("http://localhost:3000/allHoldings").then((res) => {
      setAllHoldings(res.data);
    })
  }, []);

  const labels = allHoldings.map((stock) => stock.name);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Holdings',
        data: allHoldings.map((stock) => stock.qty * stock.price),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };


  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profitClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profitClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={profitClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>

      <div className="row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div className="col" style={{ flex: "1 1 200px", textAlign: "center" }}>
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col" style={{ flex: "1 1 200px", textAlign: "center" }}>
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col" style={{ flex: "1 1 200px", textAlign: "center" }}>
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticleGraph data={data} />
    </>
  );
};

export default Holdings;
