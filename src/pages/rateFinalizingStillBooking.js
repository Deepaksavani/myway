import React, { Component } from "react";
import Headers from "../component/header";
import SideMenu from "../component/sidemenu";
import FileUpload from "./../assets/img/file.png";
import ReactTable from "react-table";
import { Button, Modal, ModalBody, UncontrolledCollapse } from "reactstrap";
import { Collapse } from "react-bootstrap";
import axios from "axios";
import appSettings from "../helpers/appSetting";
import { authHeader } from "../helpers/authHeader";
import Autocomplete from "react-autocomplete";
import { encryption } from "../helpers/encryption";
import maersk from "./../assets/img/maersk.png";

class RateFinalizingStillBooking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalProfit: false,
      modalRequest: false,
      selectedFileName: "",
      showContent: false,
      modalBook: false,
      BookingNo: "",
      Booking: [],
      Booking1: [],
      Booking2: [],
      Booking3: [],
      Booking4: [],
      Booking5: [],
      shiperVal: "",
      consigneeval: "",
      commodityData: [],
      selectedCommodity: "",
      selectedFilePath: "",
      selectedType: "",
      ConsigneeID: 0,
      ShipperID: 0,
      fields: {},
      Consignee: [],
      Shipper: [],
     
      packageTypeData: [],
      userType: "",
      NonCustomerData: [],
      QuotationData: [],
      QuotationSubData: [],
      typeofMove: "",
      cargoType: "",
      
      //dynamic element
      TruckTypeData: [
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: ""
        }
      ],
      spacEqmtType: [],
      multiCBM: [],
      referType: [],
      flattack_openTop: [],
    };

    this.toggleProfit = this.toggleProfit.bind(this);
    this.toggleRequest = this.toggleRequest.bind(this);
    this.toggleBook = this.toggleBook.bind(this);
    this.HandleCommodityDropdown = this.HandleCommodityDropdown.bind(this);
    this.BookigGridDetailsList = this.BookigGridDetailsList.bind(this);
    this.HandlePackgeTypeData = this.HandlePackgeTypeData.bind(this);
    this.HandleTruckTypeData = this.HandleTruckTypeData.bind(this);
  }
  componentDidMount() {
    debugger;

    if (
      typeof this.props.location.state.BookingNo != "undefined" &&
      typeof this.props.location.state.BookingNo != ""
    ) {
      var userType = encryption(
        window.localStorage.getItem("usertype"),
        "desc"
      );
      var BookingNo = this.props.location.state.BookingNo;
      this.setState({ BookingNo, userType });
      setTimeout(() => {
        this.HandleCommodityDropdown();
        this.HandlePackgeTypeData();
        this.BookigGridDetailsList();
      }, 100);
    }
  }

  ////Package Type Dropdata DataBind Methos

  HandlePackgeTypeData() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/PackageTypeListDropdown`,

      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ packageTypeData: data });
    });
  }
  HandleChangeSelect(field, e) {
    let fields = this.state.fields;
    if (e.target.value == "Select") {
      fields[field] = "";
    } else {
      fields[field] = e.target.value;
    }
    this.setState({
      fields,
      selectShipStage: []
    });
    this.BindShipmentStage();
  }

  HandleChangeCon(field, e) {
    let self = this;
    let fields = this.state.fields;
    fields[field] = e.target.value;
    if (fields[field].length > 3) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/CustomerList`,
        data: {
          CustomerName: e.target.value,
          CustomerType: "Existing"
        },
        headers: authHeader()
      }).then(function(response) {
        debugger;
        if (field == "Consignee") {
          self.setState({
            Consignee: response.data.Table,
            fields
          });
        } else {
          self.setState({
            Shipper: response.data.Table,
            fields
          });
        }
      });
    } else {
      this.setState({
        fields
      });
    }
  }

  handleSelectCon(e, field, value, id) {
    let fields = this.state.fields;
    fields[field] = value;
    if (field == "Consignee") {
      this.state.ConsigneeID = id.Company_ID;
    } else {
      this.state.ShipperID = id.Company_ID;
    }

    this.setState({
      fields,
      ConsigneeID: this.state.ConsigneeID,
      ShipperID: this.state.ShipperID
    });
  }

  ////this method for NonCustomerList bind
  NonCustomerList = () => {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/NonCustomerList`,
      data: {
        MyWayUserID: 2679
      },
      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ NonCustomerData: data });
    });
  };

  ////this method for Commodity drop-down bind
  HandleCommodityDropdown() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/CommodityDropdown`,
      data: {},
      headers: authHeader()
    }).then(function(response) {
      debugger;

      var commodityData = response.data.Table;
      self.setState({ commodityData }); ///problem not working setstat undefined
    });
  }

  toggleBook(e) {
    e.stopPropagation();
    this.setState(prevState => ({
      modalBook: !prevState.modalBook
    }));
  }

  toggleProfit() {
    this.setState(prevState => ({
      modalProfit: !prevState.modalProfit
    }));
  }

  toggleRequest() {
    this.setState(prevState => ({
      modalRequest: !prevState.modalRequest
    }));
  }

  onDocumentChangeHandler = event => {
    this.setState({
      selectedFileName: event.target.files[0].name
    });
  };
  
  ////change value of SelectType methiod
  HandleRadioBtn = e => {
    debugger;
    var selectedType = e.target.value;
    this.setState({ selectedType });
  };

  ////this methos for bookig details BookigGridDetailsList
  BookigGridDetailsList() {
    debugger;
    let self = this;
    var bookingNo = self.state.BookingNo;
    var userId = encryption(window.localStorage.getItem("userid"), "desc");
    if (bookingNo !== "" && bookingNo !== null) {
      axios({
        method: "post",
        url: `${appSettings.APIURL}/BookigGridDetailsList`,
        data: {
          UserID: 874654, //userId, //874654, ,
          BookingID: 830651 // 830651 // bookingNo
        },
        headers: authHeader()
      }).then(function(response) {
        console.log(response.data, "booking Details Data");
        var QuotationData = response.data.Table4;
        var QuotationSubData = response.data.Table5;
        var Booking = response.data.Table;
        var CargoDetails=response.data.Table2
        debugger;
        if (typeof QuotationData !== "undefined") {
          if (QuotationData.length > 0 && QuotationSubData.length > 0) {
            self.setState({ QuotationData, QuotationSubData, Booking });
          }
        }
        if (typeof Booking !== "undefined") {
          if (Booking.length > 0) {
            if (Booking[0].typeofMove === 1) {
              self.setState({ typeofMove: "Port 2 Port" });
            }
            if (Booking[0].typeofMove === 2) {
              self.setState({ typeofMove: "Door 2 Port" });
            }
            if (Booking[0].typeofMove === 3) {
              self.setState({ typeofMove: " Port to Door" });
            }
            if (Booking[0].typeofMove === 4) {
              self.setState({ typeofMove: " Door 2 Door" });
            }

            self.setState({
              multiCBM:CargoDetails,
              cargoType: Booking[0].CargoType,
              selectedCommodity: Booking[0].Commodity,
              fields: {
                Consignee: Booking[0].Consignee_Name,
                Shipper: Booking[0].Shipper_Name
              }
            });
          }
        }
      });
    }
  }
  //// this method for Handle Change values of Consignee and shipper

  HandleChangeCon_Ship = e => {
    var type = e.target.name;
    var value = e.target.name;
    if (type === "Consignee") {
      this.setState({ consigneeVal: value });
    } else {
      this.setState({ shiperVal: value });
    }
  };

  //// start dynamic element for LCL-AIR-LTL

  CreateMultiCBM() {

    return this.state.multiCBM.map((el, i) => (
       
      <div className="row cbm-space" key={i}>
        <div className="col-md">
          <div className="spe-equ">
            <select
              className="select-text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              name="PackageType"
              value={el.PackageType}
            >
              <option selected>Select</option>
              {this.state.packageTypeData.map((item, i) => (
                <option key={i} value={item.PackageName}>
                  {item.PackageName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder="QTY"
              className="w-100"
              name="Quantity"
              value={el.Quantity|| ""}
              //onKeyUp={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={"L (cm)"}
              className="w-100"
              name="Lengths"
              value={el.Lengths || ""}
              // onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={"W (cm)"}
              className="w-100"
              name="Width"
              value={el.Width || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder="H (cm)"
              className="w-100"
              name="Height"
              value={el.Height || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.HandleChangeMultiCBM.bind(this, i)}
              placeholder={el.Gross_Weight === 0 ? "G W" : "G W"}
              name="GrossWt"
              value={el.GrossWt || ""}
              className="w-100"
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              disabled
              name={
                this.state.containerLoadType === "LCL"
                  ? "Volume"
                  : "VolumeWeight"
              }
              // onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={
                this.state.containerLoadType === "LCL"
                  ? "KG"
                  : this.state.containerLoadType === "AIR"
                  ? "CW"
                  : "VW"
              }
              value={
                this.state.containerLoadType === "LCL"
                  ? el.Volume
                  : el.VolumeWeight || ""
              }
              className="w-100 weight-icon"
            />
          </div>
        </div>
        {i === 0 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-plus mt-2"
                aria-hidden="true"
                onClick={this.addMultiCBM.bind(this)}
              ></i>
            </div>
          </div>
        ) : null}
        {this.state.multiCBM.length > 1 ? (
          <div className="">
            <div className="spe-equ">
              <i
                className="fa fa-minus mt-2"
                aria-hidden="true"
                onClick={this.removeMultiCBM.bind(this)}
              ></i>
            </div>
          </div>
        ) : null}
      </div>
    ));
  }

  HandleChangeMultiCBM(i, e) {
    debugger;
    const { name, value } = e.target;

    let multiCBM = [...this.state.multiCBM];

    if ("PackageType" === name) {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: value
      };
    } else {
      multiCBM[i] = {
        ...multiCBM[i],
        [name]: parseFloat(value)
      };
    }

    this.setState({ multiCBM });
    if (this.state.containerLoadType !== "LCL") {
      var decVolumeWeight =
        (multiCBM[i].Quantity *
          (multiCBM[i].Lengths * multiCBM[i].Width * multiCBM[i].Height)) /
        6000;
      if (multiCBM[i].GrossWt > parseFloat(decVolumeWeight)) {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: multiCBM[i].GrossWt
        };
      } else {
        multiCBM[i] = {
          ...multiCBM[i],
          ["VolumeWeight"]: parseFloat(decVolumeWeight)
        };
      }
    } else {
      var decVolume =
        multiCBM[i].Quantity *
        ((multiCBM[i].Lengths / 100) *
          (multiCBM[i].Width / 100) *
          (multiCBM[i].Height / 100));
      multiCBM[i] = {
        ...multiCBM[i],
        ["Volume"]: parseFloat(decVolume)
      };
    }

    this.setState({ multiCBM });

   
  }
  addMultiCBM() {
    this.setState(prevState => ({
      multiCBM: [
        ...prevState.multiCBM,
        {
          PackageType: "",
          Quantity: 0,
          Lengths: 0,
          Width: 0,
          Height: 0,
          Weight: 0,
          VolumeWeight: 0,
          Volume: 0
        }
      ]
    }));
  }
  removeMultiCBM(i) {
    let multiCBM = [...this.state.multiCBM];
    multiCBM.splice(i, 1);
    this.setState({ multiCBM });
  }

  ////End dynamic element

  //// start  spacEqmtType dyamanic element

  addSpacEqmtType(optionVal) {
    this.setState(prevState => ({
      spacEqmtType: [
        ...prevState.spacEqmtType,
        {
          TypeName: optionVal[0].SpecialContainerCode,
          Quantity: 0
        }
      ]
    }));
  }

  createUIspacEqmtType() {
    return this.state.spacEqmtType.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr spec-inner-cntr w-auto">
          <label name="TypeName">
            {el.TypeName} <span className="into-quant">X</span>
          </label>
          {/* <div className="spe-equ"> */}
          <input
            type="number"
            name="Quantity"
            min={1}
            placeholder="QTY"
            onChange={this.HandleChangeSpacEqmtType.bind(this, i)}
            value={el.Quantity || ""}
          />
          {/* </div> */}
          <i
            className="fa fa-times"
            onClick={this.removeClickSpacEqmtType.bind(this, i)}
          ></i>
        </div>
      );
    });
  }

  HandleChangeSpacEqmtType(i, e) {
    const { name, value } = e.target;

    let spacEqmtType = [...this.state.spacEqmtType];
    spacEqmtType[i] = {
      ...spacEqmtType[i],
      [name]: parseFloat(value)
    };
    this.setState({ spacEqmtType });
  }

  removeClickSpacEqmtType(i) {
    let spacEqmtType = [...this.state.spacEqmtType];
    spacEqmtType.splice(i, 1);
    this.setState({ spacEqmtType });
  }

  //// end spacEqmtType dyamanic element

  //// start refer type  dynamic element
  addClickSpecial(optionVal) {
    this.setState(prevState => ({
      referType: [
        ...prevState.referType,
        {
          Type: optionVal[0].ContainerName,
          ProfileCodeID: optionVal[0].ProfileCodeID,
          ContainerCode: optionVal[0].SpecialContainerCode,
          ContainerQuantity: 0,
          Temperature: 0,
          TemperatureType: ""
        }
      ]
    }));
  }

  createUISpecial() {
    return this.state.referType.map((el, i) => {
      return (
        <div key={i} className="row cbm-space">
          <div className="col-md">
            <div className="spe-equ">
              <label className="mt-2" name="ContainerCode">
                {el.ContainerCode}
              </label>
            </div>
          </div>
          <div className="col-md">
            <div className="spe-equ">
              <input
                type="text"
                name="ContainerQuantity"
                placeholder="Quantity"
                onChange={this.UISpecialChange.bind(this, i)}
              />
            </div>
          </div>
          <div className="col-md">
            <div className="spe-equ">
              <input
                type="text"
                name="Temperature"
                placeholder="Temp"
                onChange={this.UISpecialChange.bind(this, i)}
              />
            </div>
          </div>
          <div className="col-md mt-2">
            <div className="rate-radio-cntr">
              <div>
                <input
                  type="radio"
                  name="TemperatureType"
                  id="exist-cust"
                  value="C"
                  onChange={this.UISpecialChange.bind(this, i)}
                />
                <label
                  className="d-flex flex-column align-items-center"
                  htmlFor="exist-cust"
                >
                  Celcius
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="TemperatureType"
                  id="new-cust"
                  value="F"
                  onChange={this.UISpecialChange.bind(this, i)}
                />
                <label
                  className="d-flex flex-column align-items-center"
                  htmlFor="new-cust"
                >
                  Farenheit
                </label>
              </div>
            </div>
          </div>
          <div className="spe-equ">
            <i
              className="fa fa-minus mt-2"
              onClick={this.removeClickSpecial.bind(this, i)}
            ></i>
          </div>
        </div>
      );
    });
  }

  UISpecialChange(i, e) {
    const { name, value } = e.target;

    let referType = [...this.state.referType];
    referType[i] = {
      ...referType[i],
      [name]: name === "TemperatureType" ? value : parseFloat(value)
    };
    this.setState({ referType });
  }
  removeClickSpecial(i) {
    let referType = [...this.state.referType];
    referType.splice(i, 1);
    this.setState({ referType });
  }

  //// refer type end to dynamic element

  //// start flattack type and openTop type dynamic elememnt

  MultiCreateCBM() {
    debugger;
    return this.state.flattack_openTop.map((el, i) => (
      <div className="row cbm-space" key={i}>
        <div className="col-md">
          <div className="spe-equ">
            <label className="mr-0 mt-2" name="SpecialContainerCode">
              {el.SpecialContainerCode}
            </label>
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <select
              className="select-text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              name="PackageType"
              value={el.PackageType}
            >
              <option selected>Select</option>
              {this.state.packageTypeData.map((item, i) => (
                <option key={i} value={item.PackageName}>
                  {item.PackageName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder="Quantity"
              className="w-100"
              name="Quantity"
              value={el.Quantity}
              //onKeyUp={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={"L (cm)"}
              className="w-100"
              name="length"
              value={el.length || ""}
              // onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={"W (cm)"}
              className="w-100"
              name="width"
              value={el.width || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder="H (cm)"
              className="w-100"
              name="height"
              value={el.height || ""}
              //onBlur={this.cbmChange}
            />
          </div>
        </div>

        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={el.Gross_Weight === 0 ? "G W" : "G W"}
              name="Gross_Weight"
              value={el.Gross_Weight}
              className="w-100"
            />
          </div>
        </div>
        <div className="col-md">
          <div className="spe-equ">
            <input
              type="text"
              name="total"
              onChange={this.newMultiCBMHandleChange.bind(this, i)}
              placeholder={this.state.modeoftransport != "AIR" ? "VW" : "KG"}
              value={el.total || ""}
              className="w-100"
            />
          </div>
        </div>

        <div className="">
          <div className="spe-equ">
            <i
              className="fa fa-minus mt-2"
              aria-hidden="true"
              onClick={this.removeClickMultiCBM.bind(this)}
            ></i>
          </div>
        </div>
      </div>
    ));
  }

  newMultiCBMHandleChange(i, e) {
    const { name, value } = e.target;
    debugger;
    let flattack_openTop = [...this.state.flattack_openTop];
    if (name === "PackageType") {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: value
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        [name]: parseFloat(value)
      };
    }

    this.setState({ flattack_openTop });
    var decVolumeWeight =
      (flattack_openTop[i].Quantity *
        (flattack_openTop[i].length *
          flattack_openTop[i].width *
          flattack_openTop[i].height)) /
      6000;
    if (decVolumeWeight > parseFloat(flattack_openTop[i].Gross_Weight)) {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(decVolumeWeight)
      };
    } else {
      flattack_openTop[i] = {
        ...flattack_openTop[i],
        ["total"]: parseFloat(flattack_openTop[i].Gross_Weight)
      };
    }

    this.setState({ flattack_openTop });
  }
  addClickMultiCBM(optionsVal) {
    debugger;
    this.setState(prevState => ({
      flattack_openTop: [
        ...prevState.flattack_openTop,
        {
          SpecialContainerCode: optionsVal[0].SpecialContainerCode,
          PackageType: "",
          length: "",
          width: "",
          height: "",
          Quantity: "",
          Gross_Weight: "",
          total: ""
        }
      ]
    }));
  }
  removeClickMultiCBM(i) {
    let flattack_openTop = [...this.state.flattack_openTop];
    flattack_openTop.splice(i, 1);
    this.setState({ flattack_openTop });
  }

  ////end for flattack and openTop dynamic create elements
  ////this for Equipment Type Dynamice Create Element
  NewcreateUI() {
    return this.state.users.map((el, i) => (
      <div className="equip-plus-cntr spec-inner-cntr w-auto" key={i}>
        <label>
          {el.StandardContainerCode} <span className="into-quant">X</span>
        </label>
        <div className="spe-equ">
          <input
            type="number"
            min={1}
            placeholder="QTY"
            name="ContainerQuantity"
            value={el.ContainerQuantity || ""}
            onChange={this.newhandleChange.bind(this, i)}
          />
        </div>
        <span onClick={this.newremoveClick.bind(this, i)}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>
      </div>
    ));
  }

  newaddClick(e, option) {
    if (e.length > 0) {
      if (this.state.users.length == 0) {
        if (option.option.ContainerName === "Special Equipment") {
          this.setState({ specialEquipment: true, isSpacialEqt: false });
        } else {
          this.setState({ selected: e });
          this.setState(prevState => ({
            users: [
              ...prevState.users,
              {
                ContainerName: option.option.ContainerName,
                ProfileCodeID: option.option.ProfileCodeID,
                StandardContainerCode: option.option.StandardContainerCode,
                ContainerQuantity: 0,
                Temperature: 0,
                TemperatureType: ""
              }
            ]
          }));
        }
      } else {
        let difference = this.state.selected.filter(x => !e.includes(x));
        if (difference.length === 0) {
          if (option.option.ContainerName === "Special Equipment") {
            this.setState({
              specialEquipment: true,
              isSpacialEqt: false
            });
          } else {
            this.setState({ selected: e });
            this.setState(prevState => ({
              users: [
                ...prevState.users,
                {
                  ContainerName: option.option.ContainerName,
                  ProfileCodeID: option.option.ProfileCodeID,
                  StandardContainerCode: option.option.StandardContainerCode,
                  ContainerQuantity: 0
                }
              ]
            }));
          }
        } else {
        }
      }
    } else {
      this.setState({
        specialEquipment: false,
        isSpacialEqt: true,
        selected: [],
        users: []
      });
    }

    if (this.state.selected !== null) {
      // next
      
    }
  }

  newhandleChange(i, e) {
    const { name, value } = e.target;
    let users = [...this.state.users];
    users[i] = {
      ...users[i],
      [name]: name === "ContainerQuantity" ? parseFloat(value) : 0
    };
    this.setState({ users });
  }

  newremoveClick(i) {
    let users = [...this.state.users];
    if (users[i].ContainerName === "Special Equipment") {
      this.setState({ specialEquipment: false, isSpacialEqt: true });
    }
    users.splice(i, 1);

    let selected = [...this.state.selected];
    selected.splice(i, 1);

    this.setState({ users, selected });
  }
  //// end For Equipment to create element

  //// Create Trcuk Type dropdown dynamic element UI

  addClickTruckType() {
    this.setState(prevState => ({
      TruckTypeData: [
        ...prevState.TruckTypeData,
        {
          TruckID: "",
          TruckName: "",
          Quantity: "",
          TruckDesc: ""
        }
      ]
    }));
  }

  createUITruckType() {
    return this.state.TruckTypeData.map((el, i) => {
      return (
        <div key={i} className="equip-plus-cntr">
          <div className="spe-equ">
            <select
              className="select-text mr-3"
              name="TruckName"
              onChange={this.UITruckTypeChange.bind(this, i)}
            >
              <option>Select</option>
              {this.state.TruckType.map((item, i) => (
                <option key={i} value={item.TruckID}>
                  {item.TruckName}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="Quantity"
              placeholder="Quantity"
              onChange={this.UITruckTypeChange.bind(this, i)}
            />
          </div>
          {i === 0 ? (
            <div className="col-md">
              <div className="spe-equ">
                <i
                  className="fa fa-plus mt-2"
                  aria-hidden="true"
                  onClick={this.addClickTruckType.bind(this)}
                ></i>
              </div>
            </div>
          ) : null}
          {this.state.TruckTypeData.length > 1 ? (
            <div className="col-md">
              <div className="spe-equ mt-2">
                <i
                  className="fa fa-minus"
                  aria-hidden="true"
                  onClick={this.removeClickTruckType.bind(this)}
                ></i>
              </div>
            </div>
          ) : null}
        </div>
      );
    });
  }

  UITruckTypeChange(i, e) {
    const { name, value } = e.target;

    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData[i] = {
      ...TruckTypeData[i],
      [name]: name === "Quantity" ? parseInt(value) : value,
      ["TruckDesc"]:
        name === "TruckName"
          ? e.target.options[e.target.selectedIndex].text
          : TruckTypeData[i].TruckDesc
    };
    this.setState({ TruckTypeData });
  }
  removeClickTruckType(i) {
    let TruckTypeData = [...this.state.TruckTypeData];
    TruckTypeData.splice(i, 1);
    this.setState({ TruckTypeData });
  }

  //// End Truck Tyep Dynamic element

  //// Handle Truck Type Method

  HandleTruckTypeData() {
    let self = this;

    axios({
      method: "post",
      url: `${appSettings.APIURL}/TruckTypeListDropdown`,

      headers: authHeader()
    }).then(function(response) {
      var data = response.data.Table;
      self.setState({ TruckType: data });
    });
  }
  //// end method
  render() {
    const {
      Booking,

      selectedType
    } = this.state;

    let className = "butn m-0";
    if (this.state.showContent == true) {
      className = "butn cancel-butn m-0";
    } else {
      className = "butn m-0";
    }

    var i = 0;
    console.log(this.state.multiCBM, "..................multiCBM");
    

    return (
      <React.Fragment>
        <Headers />
        <div className="cls-ofl">
          <div className="cls-flside">
            <SideMenu />
          </div>
          <div className="cls-rt no-bg">
            <div className="rate-fin-tit title-sect mb-4">
              <h2>Booking Details</h2>
            </div>
            <div className="row">
              {/* <div className="col-md-4">
                <div className="rate-table-left rate-final-left">
                  <div>
                    <h3>Locals</h3>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input id="ugm" type="checkbox" name={"local"} />
                            <label htmlFor="ugm">UGM</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input id="bl" type="checkbox" name={"local"} />
                            <label htmlFor="bl">B/L</label>
                          </div>
                          <span>25$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="stuffing"
                              type="checkbox"
                              name={"local"}
                            />
                            <label htmlFor="stuffing">Stuffing</label>
                          </div>
                          <span>100$</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3>Subcharges</h3>
                    <div className="cont-costs">
                      <div className="remember-forgot d-block m-0">
                        <div>
                          <div className="d-flex">
                            <input
                              id="cont-clean"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="cont-clean">Container Clean</label>
                          </div>
                          <span>50$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="fumi"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="fumi">Fumigation</label>
                          </div>
                          <span>25$</span>
                        </div>
                        <div>
                          <div className="d-flex">
                            <input
                              id="tarpau"
                              type="checkbox"
                              name={"subcharges"}
                            />
                            <label htmlFor="tarpau">Tarpaulin</label>
                          </div>
                          <span>100$</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="col-md-12">
                <div className="pb-4" style={{ backgroundColor: "#fff" }}>
                  <div className="rate-final-contr">
                    <div className="title-border d-flex align-items-center justify-content-between py-3">
                      <h3>Quotation Price</h3>
                    </div>
                    <div className="react-rate-table">
                      <ReactTable
                        columns={[
                          {
                            columns: [
                              {
                                Cell: row => {
                                  i++;
                                  return (
                                    <React.Fragment>
                                      <div className="d-flex align-items-center">
                                        <div className="cont-costs still-maersk rate-tab-check p-0">
                                          <div className="remember-forgot d-block m-0">
                                            <input
                                              id={"maersk-logo" + i}
                                              type="checkbox"
                                              name={"rate-tab-check"}
                                            />
                                            <label
                                              htmlFor={"maersk-logo" + i}
                                            ></label>
                                          </div>
                                        </div>
                                        <div>
                                          <p className="details-title">
                                            <img
                                              src={maersk}
                                              alt="maersk icon"
                                            />
                                          </p>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  );
                                },
                                width: 200
                              },
                              {
                                accessor: "POL",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">POL</p>
                                      <p className="details-para">
                                        {row.original.POL}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                accessor: "POD",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">POD</p>
                                      <p className="details-para">
                                        {row.original.POD}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },

                              {
                                accessor: "ContainerType",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">Container</p>
                                      <p className="details-para">
                                        {row.original.ContainerType}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },
                              {
                                accessor: "ExpiryDate",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">Expiry</p>
                                      <p className="details-para">
                                        {new Date(
                                          row.original.ExpiryDate
                                        ).toLocaleDateString("en-US")}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              },

                              {
                                accessor: "Total",
                                Cell: row => {
                                  return (
                                    <React.Fragment>
                                      <p className="details-title">Price</p>
                                      <p className="details-para">
                                        {row.original.Total}
                                      </p>
                                    </React.Fragment>
                                  );
                                }
                              }
                            ]
                          }
                        ]}
                        data={this.state.QuotationData}
                        minRows={0}
                        showPagination={false}
                        className="-striped -highlight"
                        SubComponent={row => {
                          return (
                            <div style={{ padding: "20px 0" }}>
                              <ReactTable
                                data={this.state.QuotationSubData}
                                columns={[
                                  {
                                    columns: [
                                      {
                                        Header: "C.Type",
                                        accessor: "Type"
                                      },
                                      {
                                        Header: "C.Name",
                                        accessor: "ChargeCode"
                                      },
                                      {
                                        Header: "Units",
                                        accessor: "Chargeitem"
                                      },
                                      {
                                        Header: "Unit Price",
                                        accessor: "Amount"
                                      },
                                      {
                                        Header: "Final Payment",
                                        accessor: "Total"
                                      }
                                    ]
                                  }
                                ]}
                                defaultPageSize={3}
                                showPagination={false}
                              />
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="rate-final-contr">
                    <Collapse in={this.state.showContent}>
                      <div>
                        <div className="title-border py-3">
                          <h3>Rate Query</h3>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <p className="details-title">Shipment Type</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Mode of Transport</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].ModeOfTransport
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Container Load</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].CargoType : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Equipment Types</p>
                            <p className="details-para"> </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Special Equipment</p>
                            <p className="details-para"></p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">
                              HazMat &amp; Unstackable
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Inco Terms</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].Incoterm : ""}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Type of Move</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].typeofMove === 1
                                  ? "Port 2 Port"
                                  : Booking[0].typeofMove === 2
                                  ? "Door 2 Port"
                                  : Booking[0].typeofMove === 3
                                  ? "Port to Door"
                                  : Booking[0].typeofMove === 4
                                  ? "Door 2 Door"
                                  : ""
                                : null}
                            </p>
                          </div>

                          <div className="col-md-4">
                            <p className="details-title">POL</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].POL : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">POD</p>
                            <p className="details-para">
                              {Booking.length > 0 ? Booking[0].POD : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">PU Address</p>
                            <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Delivery Address</p>
                            <p className="details-para">
                              Lotus Park, Goregaon (E), Mumbai : 400099
                            </p>
                          </div>
                        </div>
                      </div>
                    </Collapse>
                    <div className="text-right">
                      <button
                        className={className}
                        id="toggler"
                        onClick={() =>
                          this.setState({
                            showContent: !this.state.showContent
                          })
                        }
                      >
                        {this.state.showContent ? (
                          <span>VIEW LESS</span>
                        ) : (
                          <span>VIEW MORE</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rate-final-contr">
                    <div>
                      <div className="title-border py-3">
                        <h3>Customer Details</h3>
                      </div>
                      <div className="">
                        <div className="row">
                          <div className="col-md-4">
                            <p className="details-title">Account/Customer</p>

                            <p className="details-para">
                              {selectedType === "Shipper"
                                ? Booking[0].Shipper_Name
                                : selectedType === "Consignee"
                                ? Booking[0].Consignee_Name
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {/* {this.state.selectedType === "Shipper"
                                ? Booking3.length > 0
                                  ? Booking3[0].ShipperAddress
                                  : null
                                : Booking3.length > 0
                                ? Booking3[0].ConsigneeAddress
                                : null} */}

                              {selectedType === "Shipper"
                                ? Booking[0].Shipper_Displayas
                                : selectedType === "Consignee"
                                ? Booking[0].Consignee_Displayas
                                : null}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <p className="details-title">Notification Person</p>
                            <p className="details-para">Raj Mahlotra</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className=" ">
                        <div className="rate-radio-cntr">
                          <div>
                            <input
                              type="radio"
                              onChange={this.HandleRadioBtn}
                              name="cust-select"
                              id="exist-cust"
                              checked={
                                this.state.selectedType === "Consignee"
                                  ? true
                                  : false
                              }
                              value="Consignee"
                            />
                            <label
                              className="d-flex flex-column align-items-center"
                              htmlFor="exist-cust"
                            >
                              Consignee
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              onChange={this.HandleRadioBtn}
                              name="cust-select"
                              id="new-cust"
                              checked={
                                this.state.selectedType === "Shipper"
                                  ? true
                                  : false
                              }
                              value="Shipper"
                            />
                            <label
                              className="d-flex flex-column align-items-center"
                              htmlFor="new-cust"
                            >
                              Shipper
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="title-border py-3">
                        <h3>Consignee Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
                            <p className="details-title">Consignee Name</p>
                            {this.state.userType !== "Customer" ? (
                              <input
                                type="text"
                                name="Consignee"
                                value={this.state.consigneeVal}
                              />
                            ) : (
                              <Autocomplete
                                getItemValue={item => item.Company_Name}
                                items={this.state.Consignee}
                                renderItem={(item, isHighlighted) => (
                                  <div
                                    style={{
                                      background: isHighlighted
                                        ? "lightgray"
                                        : "white"
                                    }}
                                    value={item.Company_ID}
                                  >
                                    {item.Company_Name}
                                  </div>
                                )}
                                onChange={this.HandleChangeCon.bind(
                                  this,
                                  "Consignee"
                                )}
                                // menuStyle={this.state.menuStyle}
                                onSelect={this.handleSelectCon.bind(
                                  this,
                                  item => item.Company_ID,
                                  "Consignee"
                                )}
                                value={this.state.fields["Consignee"]}
                              />
                            )}
                          </div>

                          {/* <p className="details-para">
                              {Booking3.length > 0
                                ? Booking3[0].Consignee
                                : null}
                            </p> */}

                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].Consignee_Displayas
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="title-border py-3">
                        <h3>Shipper Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6 login-fields">
                            <p className="details-title">Shipper Name</p>
                            {this.state.userType !== "Customer" ? (
                              <input
                                type="text"
                                name="Shipper"
                                onChange={this.HandleChangeCon_Ship}
                                value={this.state.shipperval}
                              />
                            ) : (
                              <Autocomplete
                                getItemValue={item => item.Company_Name}
                                items={this.state.Shipper}
                                renderItem={(item, isHighlighted) => (
                                  <div
                                    style={{
                                      background: isHighlighted
                                        ? "lightgray"
                                        : "white"
                                    }}
                                  >
                                    {item.Company_Name}
                                  </div>
                                )}
                                value={this.state.fields["Shipper"]}
                                onChange={this.HandleChangeCon.bind(
                                  this,
                                  "Shipper"
                                )}
                                // menuStyle={this.state.menuStyle}
                                onSelect={this.handleSelectCon.bind(
                                  this,
                                  item => item.Company_ID,
                                  "Shipper"
                                )}
                                isMulti
                              />
                            )}
                            {/* <p className="details-para">
                              {Booking3.length > 0 ? Booking3[0].Shipper : null}
                            </p> */}
                          </div>

                          <div className="col-md-4">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].Shipper_Displayas
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 login-fields">
                        <p className="details-title">Commodity</p>
                        <select
                          disabled={true}
                          value={this.state.selectedCommodity}
                        >
                          <option>Select</option>
                          {this.state.commodityData.map((item, i) => (
                            <option key={i} value={item.id}>
                              {item.Commodity}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* <div className="row">
                      <div className="col-md">
                        <div className="rename-cntr login-fields">
                          <label>Notify Party</label>
                          <select>
                            <option>Name</option>
                            <option>Name</option>
                            <option>Name</option>
                            <option>Name</option>
                          </select>
                        </div>
                      </div>
                      
                    </div> */}
                    <div>
                      <div className="title-border py-3">
                        <h3>Buyer Details</h3>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <p className="details-title">Buyer Name</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].Buyer_Name
                                : null}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="details-title">Address</p>
                            <p className="details-para">
                              {Booking.length > 0
                                ? Booking[0].Buyer_Displayas
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="title-border py-3"
                        style={{ width: "100%" }}
                      >
                        <h3>Cargo Details</h3>
                      </div>
                      <div>
                        {this.state.multiCBM.length > 0
                          ? this.CreateMultiCBM()
                          : null}
                      </div>
                    </div>
                    <div className="row cargodetailsB">
                      {/* <ReactTable
                        data={Booking2}
                        columns={[
                          {
                            columns: [
                              {
                                Header: "Package Count",
                                accessor: "PackageCount"
                              },
                              {
                                Header: "Volume",
                                accessor: "Volume"
                              },
                              {
                                Header: "Weight",
                                accessor: "Weight"
                              }
                            ]
                          }
                        ]}
                        defaultPageSize={3}
                        minRows={1}
                        showPagination={false}
                      /> */}
                    </div>
                    {/* <div className="text-right">
                      <a href="quote-table" className="butn">
                        Send
                      </a>
                    </div> */}
                    <div className="rename-cntr login-fields d-block">
                      {/* <input
                        type="file"
                        onChange={this.onDocumentChangeHandler}
                      ></input> */}
                      <div className="d-flex w-100 mt-4 align-items-center">
                        <div className="w-100">
                          <input
                            id="file-upload"
                            className="file-upload d-none"
                            type="file"
                            onChange={this.onDocumentChangeHandler}
                          />
                          <label htmlFor="file-upload">
                            <div className="file-icon">
                              <img src={FileUpload} alt="file-upload" />
                            </div>
                            Add File
                          </label>
                        </div>
                      </div>
                      <a
                        href={
                          "https://vizio.atafreight.com/WebVizio_3_0/" +
                          this.state.selectedFilePath
                        }
                      >
                        <p className="file-name w-100 text-center mt-1">
                          {this.state.selectedFileName}
                        </p>
                      </a>
                    </div>
                    <center>
                      <button
                        onClick={this.toggleBook}
                        className="butn more-padd mt-4"
                      >
                        Update Booking
                      </button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            className="amnt-popup"
            isOpen={this.state.modalProfit}
            toggle={this.toggleProfit}
            centered={true}
          >
            <ModalBody>
              <div className="d-flex align-items-center">
                <p className="details-title mr-3">Amount</p>
                <div class="spe-equ d-block m-0 flex-grow-1">
                  <input type="text" placeholder="Enter Amount" class="w-100" />
                </div>
              </div>
              <div className="text-center">
                <Button className="butn" onClick={this.toggleProfit}>
                  Done
                </Button>
              </div>
            </ModalBody>
          </Modal>

          {/* {------------------Create Booking Modal --------------} */}
          <Modal
            className="delete-popup pol-pod-popup"
            isOpen={this.state.modalBook}
            toggle={this.toggleBook}
            centered={true}
          >
            <ModalBody>
              <h3 className="mb-4">Create Booking</h3>
              <div className="rename-cntr login-fields">
                <label>Quotation Price</label>
                <input type="text" value="5000" disabled />
              </div>
              <div className="rate-radio-cntr justify-content-center mb-3">
                <div>
                  <input
                    className="d-none"
                    type="radio"
                    name="cons-ship"
                    id="consignee"
                  />
                  <label className="m-0" htmlFor="consignee">
                    Consignee
                  </label>
                </div>
                <div>
                  <input
                    className="d-none"
                    type="radio"
                    name="cons-ship"
                    id="shipper"
                  />
                  <label className="m-0" htmlFor="shipper">
                    Shipper
                  </label>
                </div>
              </div>
              <div className="rename-cntr login-fields">
                <label>Consignee Details</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Notify Party</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Details</label>
                <input type="text" placeholder="Enter Cargo Details" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Length</label>
                <input type="text" placeholder="Enter Length" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Width</label>
                <input type="text" placeholder="Enter Width" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Height</label>
                <input type="text" placeholder="Enter Height" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Weight</label>
                <input type="text" placeholder="Enter Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Gross Weight</label>
                <input type="text" placeholder="Enter Gross Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>CBM</label>
                <input type="text" placeholder="Enter CBM" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Size</label>
                <input type="text" placeholder="Enter Cargo Size" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Cargo Weight</label>
                <input type="text" placeholder="Enter Cargo Weight" />
              </div>
              <div className="rename-cntr login-fields">
                <label>Buyer Name</label>
                <select>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                  <option>Name</option>
                </select>
              </div>
              <div className="rename-cntr login-fields">
                <label>Address</label>
                <textarea className="txt-add"></textarea>
              </div>
              <a
                href="/booking-table"
                className="butn"
                onClick={this.toggleBook}
              >
                Create Booking
              </a>
            </ModalBody>
          </Modal>
          {/* {------------------End Booking Modal --------------} */}
          <Modal
            className=""
            isOpen={this.state.modalRequest}
            toggle={this.toggleRequest}
            centered={true}
          >
            <ModalBody>Popup will come</ModalBody>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default RateFinalizingStillBooking;
