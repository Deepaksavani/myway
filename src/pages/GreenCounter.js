import React, { Component } from "react";
import appSettings from "../helpers/appSetting";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import VizioMyWay from "./../assets/img/greencounterchart.png";

var carboneOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: "white",
          fontSize: 14
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "white",
          fontSize: 14
        }
      }
    ]
  }
};

var volumeOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: "black",
          fontSize: 14
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "black",
          fontSize: 14
        }
      }
    ]
  }
};

var greencounterOption = {
  legend: {
    display: false
  },
  rotation: 0.75 * Math.PI,
  circumference: 1.5 * Math.PI,
  cutoutPercentage: 80,
  padding: 40
};
 
class GreenCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volumechartData: [],
      carbonechartData: [],
      greencounterData: [],
      selectData: [
        { key: "Year", value: "Year" },
        { key: "Month", value: "Month" }
      ],
      volumeselectType: "Year",
      carboneselectType: "Year",
      treecount:"",
      cotowemission:""
    };
  }

  componentWillMount() {
    this.HandleVolumeChartData();
    this.HandleCarboneChartData();
    this.HandleGreenCounterChartData();
  }

  HandleVolumeChangeSelect(event) {
    this.HandleVolumeChartData(event.target.value);
  }
  HandleCarboneChangeSelect(event) {
    this.HandleCarboneChartData(event.target.value);
  }
  HandleVolumeChartData(selectval) {
    let self = this;
    var selectvalnew = this.state.volumeselectType;

    if (typeof selectval != "undefined") {
      selectvalnew = selectval;
    }
    var ipaddress = window.localStorage.getItem("ipaddress");
    var userid = window.localStorage.getItem("userid");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/GreenCounterEmission`,
      data: {
        UserID: userid,
        ViewType: selectvalnew,
        publicIPAddress: ipaddress,
        PrivateIPAddress: ""
      },
      headers: authHeader()
    }).then(response => {
      self.setState({ volumechartData: response.data.Table });     
    });
  }
  HandleCarboneChartData(selectval) {
    let self = this;
    var selectcartype = this.state.carboneselectType;
    if (typeof selectval != "undefined") {
      selectcartype = selectval;
    }

    var ipaddress = window.localStorage.getItem("ipaddress");
    var userid = window.localStorage.getItem("userid");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/GreenCounterEmission`,
      data: {
        UserID: userid,
        ViewType: selectcartype,
        publicIPAddress: ipaddress,
        PrivateIPAddress: ""
      },
      headers: authHeader()
    }).then(response => {
      self.setState({
        carbonechartData: response.data.Table
      });
    });
  }

  HandleGreenCounterChartData() {
    debugger;
    let self = this;
    var ipaddress = window.localStorage.getItem("ipaddress");
    var userid = window.localStorage.getItem("userid");
    axios({
      method: "post",
      url: `${appSettings.APIURL}/GreenCounterEmission`,
      data: {
        UserID: userid,
        ViewType: "Web",
        publicIPAddress: ipaddress,
        PrivateIPAddress: ""
      },
      headers: authHeader()
    }).then(response => {
      debugger;
      console.log(response);
      self.setState({ greencounterData: response.data.Table });
      var greendata=response.data.Table;
      self.setState({treecount:greendata[0]["NoOfTreesPlanted"],cotowemission:(greendata[0]["CarbonEmission"]).toFixed(2)});
    });
  }
  render() {
    let vollabel = [];
    let carlabel = [];
    let volumnedata = [];
    let carbonelabledata = [];
    let greenCounterdata = {
      labels: ["Green", "Red"],
      datasets: [
        {
          data: [70, 30],
          backgroundColor: ["#63CD16", "#EF1617"],
          hoverBackgroundColor: ["#63CD16", "#EF1617"],
          borderWidth: 0
        }
      ],
      text: "23%"
    };

    for (let i = 0; i < this.state.volumechartData.length; i++) {
      vollabel.push(this.state.volumechartData[i]["CO2YEAR"]);
      volumnedata.push(this.state.volumechartData[i]["Tons_Weight"]);
    }

    for (let i = 0; i < this.state.carbonechartData.length; i++) {
      carlabel.push(this.state.carbonechartData[i]["CO2YEAR"]);
      carbonelabledata.push(this.state.carbonechartData[i]["CarbonEmission"]);
    }
    const volumeChartData = {
      labels: vollabel,
      datasets: [
        {
          backgroundColor: "rgba(11,182,226,1)",
          borderColor: "rgba(11,182,226,1)",
          borderWidth: 2,
          data: volumnedata
        }
      ]
    };

    const carboneCharData = {
      labels: carlabel,
      datasets: [
        {
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(255,255,255,1)",
          borderCapStyle: "round",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 5,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: carbonelabledata
        }
      ]
    };

    return (
      <>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>

          <div className="row grncuntr">
            <div className="col-md-6">
              <div className="card carbonechart">
                <div>
                  <label className="grncuntr-lbl">Volume Analysis</label>
                  <select
                    className="brncuntr-select"
                    onChange={this.HandleVolumeChangeSelect.bind(this)}
                  >
                    {this.state.selectData.map(team => (
                      <option key={team.key} value={team.value}>
                        {team.value}
                      </option>
                    ))}
                  </select>
                </div>
                <Bar
                  data={volumeChartData}
                  width={100}
                  height={50}
                  options={volumeOptions}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="card carbonemn-card">
                <div>
                  <label className="grncuntr-lbl1">Carbon Emission</label>
                  <select
                    className="brncuntr-select1"
                    onChange={this.HandleCarboneChangeSelect.bind(this)}
                  >
                    {this.state.selectData.map(team => (
                      <option key={team.key} value={team.value}>
                        {team.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {/* <Chart
                    chartType="Line"
                    data={Carbonedata}
                    options={carboneoptions}
                  /> */}
                  <Line
                    data={carboneCharData}
                    width={100}
                    height={50}
                    options={carboneOptions}
                  />
                </div>
              </div>
              <div className="card">
                <div>
                  <label className="grncuntr-lbl">Green Conuter</label>
                </div>
                <div className="dot">
                  {/* <div className="dot1"></div> */}

                  <Doughnut
                    data={greenCounterdata}
                    width={700}
                    height={600}
                    options={greencounterOption}
                  />
                  <img
                    src={VizioMyWay}
                    alt="vizio-icon"
                    className="greenchart-img"
                  />
                  <label className="greenchartlbl">
                    Tons of
                    <br /> CO2 Emission
                  </label>
                  <label className="counterval">
                    {this.state.cotowemission}
                  </label>
                  
                </div>
                <label className="greenchartlbl1">
                  {this.state.treecount} tree Planted
                </label>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default GreenCounter;