import React, { Component } from "react";
import axios from "axios";
import { authHeader } from "../helpers/authHeader";
import appSettings from "../helpers/appSetting";
import "react-table/react-table.css";
import "../styles/custom.css";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import { Button, Modal, ModalBody } from "reactstrap";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import ReactTable from "react-table";
import maersk from "./../assets/img/maersk.png";
import Select from "react-select";
import { Link } from "react-router-dom";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import GreenIcon from "./../assets/img/green-circle.png";
import RedIcon from "./../assets/img/red-circle.png";

const { compose } = require("recompose");
const POLMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={props.markerPOLData}>
    <Marker position={props.markerPOLData} icon={GreenIcon}></Marker>
  </GoogleMap>
));
const PODMaps = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={props.markerPODData}>
    <Marker position={props.markerPODData} icon={RedIcon}></Marker>
  </GoogleMap>
));

class RateTable extends Component {
  constructor(props) {
    super(props);

    this.state = {

      shipmentType: "",
      modeoftransport: "",
      containerLoadType: "",
      typeofMove:"",
      HazMat:false,
      NonStackable:false,
      Custom_Clearance:false,


      modalEdit: false,
      modalQuant: false,
      value: 50,
      RateDetails: [],
      values: [],
      RateSubDetails: [],
      checkSelection: [],
      polLatLng: {},
      podmapData: {},
      selected: {},
      selectedDataRow: [],
      selectAll: 0
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleQuant = this.toggleQuant.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
    this.checkSelection = this.checkSelection.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  componentDidMount() {
    debugger;
    if (typeof this.props.location.state !== "undefined") {
      if (this.props.location.state !== null) {
        var isSearch = this.props.location.state.isSearch;
        if (isSearch) {
          var paramData = this.props.location.state;
          var modeofTransport = this.props.location.state.containerLoadType;
          if (modeofTransport === "FCL") {
            this.HandleRateDetailsFCL(paramData);
          } else if (modeofTransport === "AIR") {
            this.HandleRateDetailsLCL(paramData);
          }
        }
      }
    } else {
      this.props.history.push("rate-search");
    }
  }

  toggleEdit() {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }
  toggleQuant() {
    this.setState(prevState => ({
      modalQuant: !prevState.modalQuant
    }));
  }

  handleCheck() {
    debugger;
    // this.props.history.push({
    //   pathname: "rate-finalizing",
    //   //state: { rateDetail: this.state.RateDetails }
    // });
  }

  toggleRow(rateID, rowData) {
    debugger;

    const newSelected = Object.assign({}, this.state.selected);
    newSelected[rateID] = !this.state.selected[rateID];
    this.setState({
      selected: rateID ? newSelected : false
    });
    var selectedRow = [];

    if (this.state.selectedDataRow.length == 0) {
      selectedRow.push(rowData._original);
      this.setState({
        selectedDataRow: selectedRow
      });
    } else {
      if (newSelected[rateID] === true) {
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          if (
            this.state.selectedDataRow[i].rateID === rowData._original.rateID
          ) {
            selectedRow.splice(i, 1);

            break;
          } else {
            selectedRow = this.state.selectedDataRow;
            selectedRow.push(rowData._original);
            break;
          }
        }
      } else {
        for (var i = 0; i < this.state.selectedDataRow.length; i++) {
          if (
            this.state.selectedDataRow[i].rateID === rowData._original.rateID
          ) {
            selectedRow = this.state.selectedDataRow;
            selectedRow.splice(i, 1);
            break;
          }
        }
      }
    }
    this.setState({
      selectedDataRow: selectedRow
    });
  }

  checkSelection(evt, row) {
    console.log(row.index);
    let tempRate = this.state.RateDetails;
    tempRate[row.index].checkbx = evt.target.checked;
    this.setState({ RateDetails: tempRate });
    console.log(this.state.RateDetails[row.index]);
  }

  HandleRateDetailsFCL(paramData) {
    var dataParameter = {};
    if (paramData.isSearch) {
      debugger;
      var rTypeofMove =
        paramData.typesofMove === "p2p"
          ? 1
          : paramData.typesofMove === "d2p"
          ? 2
          : paramData.typesofMove === "d2d"
          ? 4
          : paramData.typesofMove === "p2d"
          ? 3
          : 0;

      var rModeofTransport =
        paramData.modeoftransport === "SEA"
          ? "Ocean"
          : paramData.modeoftransport === "AIR"
          ? "Air"
          : paramData.modeoftransport === "ROAD"
          ? "Inland"
          : "";
      var polAddress = paramData.polfullAddData;
      var podAddress = paramData.podfullAddData;
      var rateQueryDim = [];
      var containerdetails = paramData.users;
      debugger;
      var polLatLng = new Object();
      var podLatLng = new Object();

      var polmapData = polAddress.GeoCoordinate;
      polLatLng.lat = Number(polmapData.split(",")[0]);
      polLatLng.lng = Number(polmapData.split(",")[1]);
      var podmapData = podAddress.GeoCoordinate;
      podLatLng.lat = Number(podmapData.split(",")[0]);
      podLatLng.lng = Number(podmapData.split(",")[1]);

      this.setState({ polLatLng: polLatLng, podmapData: podLatLng });

      dataParameter = {
        QuoteType: paramData.containerLoadType,
        ModeOfTransport: rModeofTransport,
        Type: paramData.shipmentType,
        TypeOfMove: rTypeofMove,

        PortOfDischargeCode:
          podAddress.UNECECode !== "" ? podAddress.UNECECode : "",
        PortOfLoadingCode:
          polAddress.UNECECode !== "" ? polAddress.UNECECode : "",
        Containerdetails: containerdetails,
        OriginGeoCordinates:
          polAddress.GeoCoordinate !== "" ? polAddress.GeoCoordinate : "",
        DestGeoCordinate:
          podAddress.GeoCoordinate !== "" ? podAddress.GeoCoordinate : "",
        PickupCity:
          polAddress.NameWoDiacritics !== "" ? polAddress.NameWoDiacritics : "",
        DeliveryCity:
          podAddress.NameWoDiacritics !== "" ? podAddress.NameWoDiacritics : "",
        Currency: paramData.currencyCode,
        ChargeableWeight: 0,
        RateQueryDim: rateQueryDim
      };


      this.setState({
        shipmentType: paramData.shipmentType,
        modeoftransport: paramData.modeoftransport,
        containerLoadType: paramData.containerLoadType,
        typeofMove:rTypeofMove,
        HazMat:false,
        NonStackable:false,
        Custom_Clearance:false,

      })
    }

    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchQuery`,
      data: dataParameter,
      headers: authHeader()
    }).then(function(response) {
      debugger;
      console.log(response);
      var ratetable = response.data.Table;
      var ratetable1 = response.data.Table1;
      if (ratetable != null) {
        self.setState({
          RateDetails: ratetable
        });
      }
      if (ratetable1 != null) {
        self.setState({
          RateSubDetails: ratetable1
        });
      }
    });
  }

  HandleRateDetailsLCL(paramData) {
    var dataParameter = {};
    if (paramData.isSearch) {
      debugger;
      var rTypeofMove =
        paramData.typesofMove === "p2p"
          ? 1
          : paramData.typesofMove === "d2p"
          ? 2
          : paramData.typesofMove === "d2d"
          ? 4
          : paramData.typesofMove === "p2d"
          ? 3
          : 0;

      var rModeofTransport =
        paramData.modeoftransport === "SEA"
          ? "Ocean"
          : paramData.modeoftransport === "AIR"
          ? "Air"
          : paramData.modeoftransport === "ROAD"
          ? "Inland"
          : "";
      var polAddress = paramData.polfullAddData;
      var podAddress = paramData.podfullAddData;
      var rateQueryDim = [];
      var containerdetails = paramData.users;

      this.setState({});
      dataParameter = {
        QuoteType: paramData.containerLoadType,
        ModeOfTransport: rModeofTransport,
        Type: paramData.containerLoadType,
        TypeOfMove: rTypeofMove,

        PortOfDischargeCode:
          podAddress.UNECECode !== "" ? podAddress.UNECECode : "",
        PortOfLoadingCode:
          polAddress.UNECECode !== "" ? polAddress.UNECECode : "",
        Containerdetails: containerdetails,
        OriginGeoCordinates:
          polAddress.GeoCoordinate !== "" ? polAddress.GeoCoordinate : "",
        DestGeoCordinate:
          podAddress.GeoCoordinate !== "" ? podAddress.GeoCoordinate : "",
        PickupCity:
          polAddress.NameWoDiacritics !== "" ? polAddress.NameWoDiacritics : "",
        DeliveryCity:
          podAddress.NameWoDiacritics !== "" ? podAddress.NameWoDiacritics : "",
        Currency: paramData.currencyCode,
        ChargeableWeight: 0,
        RateQueryDim: rateQueryDim
      };
    }

    debugger;
    let self = this;
    axios({
      method: "post",
      url: `${appSettings.APIURL}/RateSearchQuery`,
      data: dataParameter,
      headers: authHeader()
    }).then(function(response) {
      debugger;
      console.log(response);
      var ratetable = response.data.Table;
      var ratetable1 = response.data.Table1;
      if (ratetable != null) {
        self.setState({
          RateDetails: ratetable
        });
      }
      if (ratetable1 != null) {
        self.setState({
          RateSubDetails: ratetable1
        });
      }
    });
  }

  HandleDocumentView(evt, row) {
    debugger;
    var rowDataAry = [];
    var rowDataObj = row.original;
    rowDataAry.push(rowDataObj);

    this.setState({ checkSelection: rowDataAry });
  }

  addClick() {
    this.setState(prevState => ({
      values: [...prevState.values, ""]
    }));
  }

  createUI() {
    return this.state.values.map((el, index) => {
      return (
        <div>
          <div className="rename-cntr login-fields position-relative">
            <input type="text" />
            <i
              className="fa fa-minus equip-plus"
              id={"remove" + (index + 1)}
              onClick={this.removeClick.bind(this, index)}
            ></i>
          </div>
          <div className="rename-cntr login-fields">
            <textarea className="txt-add" placeholder="Enter POL"></textarea>
          </div>
        </div>
      );
    });
  }

  removeClick(i) {
    debugger;
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }

  render() {
    var i = 0;

    return (
      <div>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg min-hei-auto">
            <div className="rate-table-header">
              <div className="title-sect">
                <h2>Rate Table</h2>
              </div>
              <div className="login-fields mb-0 rate-tab-drop">
                <select>
                  <option>Select</option>
                  <option>Select</option>
                  <option>Select</option>
                  <option>Select</option>
                  <option>Select</option>
                </select>
              </div>
              <div className="rate-table-range">
                <span className="cust-labl clr-green">Faster</span>
                <span className="cust-labl clr-red">Cheaper</span>
                <InputRange
                  formatLabel={value => `${value} DAYS`}
                  maxValue={75}
                  minValue={32}
                  value={this.state.value}
                  onChange={value => this.setState({ value })}
                />
              </div>
              <div className="rate-table-butn">
                {/* <button
                  onClick={this.handleCheck}
                  className="blue-butn butn m-0"
                >
                  Proceed
                </button> */}
                <Link
                  to={{
                    pathname: "/rate-finalizing"
                  }}
                  className="blue-butn butn m-0"
                >
                  Proceed
                </Link>
              </div>
            </div>
            <div className="rate-table-below">
              <div className="row">
                <div className="col-md-4">
                  <div className="rate-table-left">
                    <div className="top-select d-flex justify-content-between">
                      <a href="new-rate-search" className="butn">
                        {this.state.shipmentType}
                      </a>
                      <a href="new-rate-search" className="butn">
                        {this.state.modeoftransport}
                      </a>
                      <a href="new-rate-search" className="butn">
                        {this.state.containerLoadType}
                      </a>
                    </div>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input
                              id="door"
                              type="checkbox"
                              name="typeofMove"
                            />
                            <label htmlFor="door">{this.state.typeofMove===1?"Port 2 Port":this.state.typeofMove===2?"Door 2 Port":this.state.typeofMove===4?"Port 2 Door":this.state.typeofMove===3?"Door 2 Door":""}</label>
                          </div>
                          <span>100$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="insu"
                              type="checkbox"
                              name="HazMat"
                              checked={this.state.HazMat}
                            />
                            <label htmlFor="insu">HazMat</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="cont-trak"
                              type="checkbox"
                              name="NonStackable"
                              checked={this.state.NonStackable}
                            />
                            <label htmlFor="cont-trak">
                            NonStackable
                            </label>
                          </div>
                          <span>150$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="cust-clear"
                              type="checkbox"
                              name="Custom_Clearance"
                              checked={this.state.Custom_Clearance}
                            />
                            <label htmlFor="cust-clear">Custom Clearance</label>
                          </div>
                          <span>900$</span>
                        </div>
                      </div>
                    </div>
                    <div className="pol-pod-maps-cntr">
                      <div className="pol-pod-maps">
                        <span className="rate-map-ovrly">POL</span>
                        <span
                          onClick={this.toggleEdit}
                          className="rate-map-ovrly rate-map-plus"
                        >
                          +
                        </span>
                        {/* <GoogleMapReact
                          bootstrapURLKeys={{
                            key: "AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI"
                          }}
                          defaultCenter={this.props.center}
                          defaultZoom={this.props.zoom}
                        >
                          <SourceIcon lat={59.955413} lng={30.337844} />
                        </GoogleMapReact> */}
                        <POLMaps
                          markerPOLData={this.state.polLatLng}
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                          containerElement={
                            <div style={{ height: `100%`, width: "100%" }} />
                          }
                          mapElement={<div style={{ height: `100%` }} />}
                          loadingElement={<div style={{ height: `100%` }} />}
                        ></POLMaps>
                      </div>
                      <div className="pol-pod-maps pod-maps">
                        <span className="rate-map-ovrly">POD</span>
                        <span
                          onClick={this.toggleEdit}
                          className="rate-map-ovrly rate-map-plus"
                        >
                          +
                        </span>
                        <PODMaps
                          markerPODData={this.state.podmapData}
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdUg5RYhac4wW-xnx-p0PrmKogycWz9pI&libraries=geometry,drawing,places"
                          containerElement={
                            <div style={{ height: `100%`, width: "100%" }} />
                          }
                          mapElement={<div style={{ height: `100%` }} />}
                          loadingElement={<div style={{ height: `100%` }} />}
                        ></PODMaps>
                      </div>
                    </div>
                    <a
                      href="#!"
                      onClick={this.toggleQuant}
                      className="butn white-butn w-100 mt-0"
                    >
                      Quantity
                    </a>
                  </div>
                </div>

                <div className="col-md-8 react-rate-table">
                  <ReactTable
                    columns={[
                      {
                        columns: [
                          {
                            Cell: ({ original, row }) => {
                              i++;
                              return (
                                <React.Fragment>
                                  <div className="cont-costs rate-tab-check p-0 d-inline-block">
                                    <div className="remember-forgot d-block m-0">
                                      <input
                                        id={"maersk-logo" + i}
                                        type="checkbox"
                                        name={"rate-tab-check"}
                                        // checked={
                                        //   this.state.RateDetails[i - 1].checkbx
                                        //     ? this.state.RateDetails[i - 1]
                                        //         .checkbx
                                        //     : false
                                        // }
                                        checked={
                                          this.state.selected[
                                            original.rateID
                                          ] === true
                                        }
                                        onChange={e =>
                                          this.toggleRow(original.rateID, row)
                                        }
                                      />
                                      <label
                                        htmlFor={"maersk-logo" + i}
                                      ></label>
                                    </div>
                                  </div>
                                  <div className="rate-tab-img">
                                    <img src={maersk} alt="maersk icon" />
                                  </div>
                                </React.Fragment>
                              );
                            },
                            accessor: "lineName",
                            minWidth: 200
                          },
                          {
                            Cell: row => {
                              return (
                                <>
                                  <p className="details-title">Valid Until</p>
                                  <p className="details-para">
                                    {new Date(
                                      row.original.expiryDate
                                    ).toLocaleDateString("en-US")}
                                  </p>
                                </>
                              );
                            },
                            accessor: "expiryDate",
                            minWidth: 175
                          },
                          {
                            Cell: row => {
                              return (
                                <>
                                  <p className="details-title">TT</p>
                                  <p className="details-para">
                                    {row.original.transitTime}
                                  </p>
                                </>
                              );
                            },
                            accessor: "transitTime",
                            minWidth: 120
                          },
                          {
                            Cell: row => {
                              return (
                                <>
                                  <p className="details-title">Price</p>
                                  <p className="details-para">
                                    {row.original.baseFreightFee != "" ||
                                    row.original.baseFreightFee != null
                                      ? row.original.baseFreightFee + " USD"
                                      : null}
                                  </p>
                                </>
                              );
                            },
                            accessor: "baseFreightFee",
                            minWidth: 120
                          }
                        ]
                      }
                    ]}
                    data={this.state.RateDetails}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    SubComponent={row => {
                      return (
                        <div style={{ padding: "20px 0" }}>
                          <ReactTable
                            minRows={1}
                            data={this.state.RateSubDetails}
                            columns={[
                              {
                                columns: [
                                  {
                                    Header: "Charge Name",
                                    accessor: "ChargeCode"
                                  },
                                  {
                                    Header: "Tax",
                                    accessor: "Tax"
                                  },
                                  {
                                    Header: "Units",
                                    accessor: "ChargeItem"
                                  },
                                  {
                                    Header: "Exrate",
                                    accessor: "Exrate"
                                  },
                                  {
                                    Header: "Charge Type",
                                    accessor: "ChargeType"
                                  },
                                  {
                                    Header: "Unit Price",
                                    accessor: "Rate",
                                    Cell: props => (
                                      <React.Fragment>
                                        {props.original.Rate}
                                        &nbsp;
                                        {props.original.Currency}
                                      </React.Fragment>
                                    )
                                  },
                                  {
                                    Cell: row => {
                                      return (
                                        <>
                                          {row.original.TotalAmount != "" ||
                                          row.original.TotalAmount != null
                                            ? row.original.TotalAmount + " USD"
                                            : null}
                                          {row.original.TotalAmount}
                                          &nbsp;
                                          {row.original.BaseCurrency}
                                        </>
                                      );
                                    },
                                    Header: "Final Payment",
                                    accessor: "TotalAmount"
                                  }
                                ]
                              }
                            ]}
                            showPagination={false}
                          />
                        </div>
                      );
                    }}
                  />
                  {/* <ReactTable
                    data={Data}
                    columns={columns}
                    defaultSorted={[{ id: "firstName", desc: false }]}
                  /> */}
                  <p className="bottom-profit">
                    Profit -------$ Customer Segment A Profit Margin %15
                  </p>
                </div>
              </div>
            </div>
            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalQuant}
              toggle={this.toggleQuant}
              centered={true}
            >
              <ModalBody>
                <h3 className="mb-4">Equipment Types</h3>
                <div className="equip-plus-cntr w-100 mt-0">
                  <Select
                    className="rate-dropdown"
                    // getOptionLabel={option => option.StandardContainerCode}
                    // getOptionValue={option => option.StandardContainerCode}
                    isMulti
                    // options={self.state.StandardContainerCode}
                    // onChange={this.equipChange.bind(this)}
                    // value={self.state.selected}
                    // showNewOptionAtTop={false}
                  />
                </div>
                <div className="remember-forgot d-block flex-column rate-checkbox justify-content-center">
                  <input
                    id="Special-equType"
                    type="checkbox"
                    className="d-none"
                    name={"Special-equType"}
                    // onChange={this.HandleSpecialEqtCheck.bind(this)}
                  />
                  <label htmlFor="Special-equType">Special Equipment</label>
                </div>
                <div className="spe-equ mt-0">
                  <div className="equip-plus-cntr w-100">
                    <Select
                      // isDisabled={self.state.isSpacialEqt}
                      className="rate-dropdown"
                      // getOptionLabel={option => option.SpecialContainerCode}
                      isMulti
                      // getOptionValue={option => option.SpecialContainerCode}
                      // components={animatedComponents}
                      // options={self.state.SpacialEqmt}
                      placeholder="Select Kind of Special Equipment"
                      // onChange={this.specEquipChange}
                      // value={self.state.spEqtSelect}
                      showNewOptionAtTop={false}
                    />
                  </div>
                </div>
                <Button className="butn" onClick={this.toggleQuant}>
                  Done
                </Button>
                <Button className="butn cancel-butn" onClick={this.toggleQuant}>
                  Cancel
                </Button>
              </ModalBody>
            </Modal>
            <Modal
              className="delete-popup pol-pod-popup"
              isOpen={this.state.modalEdit}
              toggle={this.toggleEdit}
              centered={true}
            >
              <ModalBody>
                <div className="pol-mar">
                  <div>
                    <div className="rename-cntr login-fields position-relative">
                      <input type="text" />
                      <i
                        className="fa fa-plus equip-plus"
                        onClick={this.addClick.bind(this)}
                      ></i>
                    </div>
                    <div className="rename-cntr login-fields">
                      <textarea
                        className="txt-add"
                        placeholder="Enter POL"
                      ></textarea>
                    </div>
                  </div>
                  {this.createUI()}
                </div>
                <Button className="butn" onClick={this.toggleEdit}>
                  Done
                </Button>
                <Button className="butn cancel-butn" onClick={this.toggleEdit}>
                  Cancel
                </Button>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default RateTable;
