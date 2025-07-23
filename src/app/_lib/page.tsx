import React from "react";

const PrivateRoute: React.FC = () => {
  return (
    <div>
      <h1>You cannot view this in the browser</h1>
      <table>
        <thead>
          <tr>
            <th>對應屬性</th>
            <th>對應名稱</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>name</td>
            <td>公路編號</td>
          </tr>
          <tr>
            <td>start</td>
            <td>起點</td>
          </tr>
          <tr>
            <td>end</td>
            <td>終點</td>
          </tr>
          <tr>
            <td>length</td>
            <td>長度</td>
          </tr>
          <tr>
            <td>otherName</td>
            <td>別稱</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// 國道5號 => id: 30500
// 台8線   => id: 40800
// 縣道122號 => id: 12200
// 台9丁線 => id: 40904
// 縣道114甲號 => id: 11401

export default PrivateRoute;
