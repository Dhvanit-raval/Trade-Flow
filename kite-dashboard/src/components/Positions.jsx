import React, { useState, useEffect } from "react";
import { positions } from "../data/data";
import axios from "axios";

const Positions = () => {
  const [allPosition, setAllPosition] = useState([]);

  useEffect(() => { // To fetch the data comming from api end-point in json response and with the help of axios we get it.
    axios.get("http://localhost:3000/allPosition").then((res) => {
      setAllPosition(res.data);
    })
  }, []);


  return (
    <>
      <h3 className="title">Positions (2)</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {allPosition.map((stock, index) => {
              const curValue = stock.price * stock.qty
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profitClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={dayClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>
    </>
  );
};

export default Positions;
