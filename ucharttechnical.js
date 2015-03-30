var defaultIndicatorAxisHeight = 15;
var defaultIndicatorAxisPaddingTop = 3;
uChart.prototype.initTechnical = function() {
  var chart = this;

  function add() {
    sum = 0;
    for (i in arguments) {
      sum = sum + 1000 * arguments[i]
    };
    return parseInt(sum) / 1000
  };

  /*----------------------------------------*/
  /*------------ SMA -----------------------*/
  /*----------------------------------------*/
  function SMA(p, InData) {
    var j = p - 1,
      l = 0,
      Sdata = [],
      dataIndex = (InData[0].length > 3) ? 4 : 1;

    while (InData[j]) {
      var k = j - p * 1 + 1;

      var SMAres = 0;
      while (k <= j) {
        SMAres = add(SMAres, InData[k][dataIndex]);
        k++;
      }
      SMAres = SMAres.toFixed(2) * 1000;
      SMAres = (SMAres / p) / 1000;

      Sdata[l] = [InData[j][0], SMAres.toFixed(2)];
      l++;
      j++;
    }

    return Sdata;
  }
  /*----------- SMA ends -------------------*/

  /*----------------------------------------*/
  /*-------Weighted Moving Average----------*/
  /*----------------------------------------*/
  function WgtMA(p, InData) {
    var j = p - 1,
      l = 0,
      Wdata = [];
    while (InData[j]) {
      var k = j - p * 1 + 1,
        m = 1;
      var WgtMAres = 0,
        weight = 0;
      while (k <= j) {
        WgtMAres = add(WgtMAres, InData[k][4] * m)
        weight = add(weight, m);
        k++;
        m++;
      }
      Wdata[l] = [InData[j][0], (WgtMAres / weight).toFixed(2)];
      l++;
      j++;
    }
    return Wdata;
  }
  /*------Weighted Moving Average ends------*/

  /*----------------------------------------*/
  /*---------- High Minus Low---------------*/
  /*----------------------------------------*/
  function HML(InData) {
    var j = 0,
      l = 0,
      Hdata = [];

    while (InData[j]) {
      var HMLres = 0;
      HMLres = add(InData[j][2], -InData[j][3]);
      Hdata[l] = [InData[j][0], HMLres.toFixed(2)];
      l++;
      j++;
    }
    return Hdata;
  }
  /*------ High Minus Low ends -------------*/

  /*----------------------------------------*/
  /*---------- Double EMA ------------------*/
  /*----------------------------------------*/
  function DEMA(p, InData) {
    var j = 0,
      l = 0,
      k = 0,
      DEdata = [],
      EMAdata = [],
      EMA2data = [];

    EMAdata = EMA(p, InData);
    EMA2data = EMA(p, EMAdata);
    j = p - 1;
    while (EMAdata[j]) {
      var DEres = 0;
      DEres = add((2 * EMAdata[j][1]), -EMA2data[k][1]);
      DEdata[l] = [EMAdata[j][0], DEres.toFixed(2)];
      l++;
      j++;
      k++;
    }
    return DEdata;
  }
  /*----------Double EMA ends --------------*/

  /*----------------------------------------*/
  /*---------- Triple EMA ------------------*/
  /*----------------------------------------*/
  function TEMA(p, InData) {
    var j = 0,
      i = 0,
      l = 0,
      k = 0,
      TEdata = [],
      EMAdata = [],
      EMA2data = [],
      EMA3data = [];

    EMAdata = EMA(p, InData);
    EMA2data = EMA(p, EMAdata);
    EMA3data = EMA(p, EMA2data);

    j = p + p - 2;
    i = p - 1;
    while (EMAdata[j]) {
      var TEres = 0;
      TEres = add(add((3 * EMAdata[j][1]), -(3 * EMA2data[i][1])), EMA3data[k][1]);
      TEdata[l] = [EMAdata[j][0], TEres.toFixed(2)];
      l++;
      j++;
      k++;
      i++;
    }
    return TEdata;
  }
  /*----------Triple EMA ends --------------*/

  /*----------------------------------------*/
  /*--------Negative Volume Index-----------*/
  /*----------------------------------------*/
  function NVI(d, InData) {
    console.log(d);
    var j = 0,
      l = 1,
      i = 0,
      k = 0,
      NVIdata = [],
      Result = [];

    while (InData[j]) {
      var date1 = new Date(InData[j][0]);
      var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
      if (d1 == d) {
        k = 1;
        break;
      }
      j++;
    }

    if (k != 1) {
      alert("Invalid Input");
      return 0;
    }

    j++;
    NVIdata[0] = 1000;
    while (InData[j]) {
      var price_change = 0,
        vol_diff = 0;
      price_change = (add(InData[j][4], -InData[j - 1][4]) / InData[j - 1][4]) * 100;
      vol_diff = add(InData[j][5], -InData[j - 1][5]);
      if (vol_diff < 0) {
        NVIdata[l] = add(NVIdata[l - 1], price_change);
      } else {
        NVIdata[l] = NVIdata[l - 1];
      }
      Result[i] = [InData[j][0], NVIdata[l]];
      i++;
      j++;
      l++;
    }
    console.log(Result);
    return Result;
  }
  /*------Negative Volume Index ends--------*/

  /*----------------------------------------*/
  /*--------Positive Volume Index-----------*/
  /*----------------------------------------*/
  function PVI(d, InData) {
    var j = 0,
      l = 1,
      i = 0,
      k = 0,
      PVIdata = [],
      Result = [];
    while (InData[j]) {
      var date1 = new Date(InData[j][0]);
      var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
      if (d1 == d) {
        k = 1;
        break;
      }
      j++;
    }

    if (k != 1) {
      alert("Invalid Input");
      return 0;
    }

    j++;
    PVIdata[0] = 1000;
    while (InData[j]) {
      var price_change = 0,
        vol_diff = 0;
      price_change = (add(InData[j][4], -InData[j - 1][4]) / InData[j - 1][4]) * 100;
      vol_diff = add(InData[j][5], -InData[j - 1][5]);
      if (vol_diff > 0) {
        PVIdata[l] = add(PVIdata[l - 1], price_change);
      } else {
        PVIdata[l] = PVIdata[l - 1];
      }
      Result[i] = [InData[j][0], PVIdata[l]];
      l++;
      i++;
      j++;
    }
    return Result;
  }
  /*------Positive Volume Index ends--------*/


  /*----------------------------------------*/
  /*---------- Mass Index ------------------*/
  /*----------------------------------------*/
  function MI(p1, p2, InData) {
    var j = p1 - 1,
      k = 0,
      l = 0,
      HMLdata = [],
      EMA1data = [],
      EMA2data = [],
      MIdata = [],
      Mdata = [];

    HMLdata = HML(InData);
    EMA1data = EMA(p1, HMLdata);
    EMA2data = EMA(p1, EMA1data);
    while (EMA2data[k]) {
      var Mres = 0;
      Mres = EMA1data[j][1] / EMA2data[k][1];
      Mdata[l] = [EMA1data[j][0], Mres];
      l++;
      k++;
      j++;
    }
    j = p2 - 1, l = 0;
    while (Mdata[j]) {
      var k = j - p2 * 1 + 1;

      var MIres = 0;
      while (k <= j) {
        MIres = add(MIres, Mdata[k][1]);
        k++;
      }
      MIdata[l] = [Mdata[j][0], MIres.toFixed(2)];
      l++;
      j++;
    }

    return MIdata;
  }
  /*------ High Minus Low ends -------------*/

  // to chevk prime Number  
  function isPrime(n) {
    if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
    var m = Math.sqrt(n);
    for (var i = 2; i <= m; i++)
      if (n % i == 0) return false;
    return true;
  }

  /*----------------------------------------*/
  /*----------Prime Numbers Oscillator------*/
  /*----------------------------------------*/
  function PNO(InData) {
    var j = 0,
      l = 0,
      nearer_prime = 0,
      PNOres = 0,
      Pdata = [];

    while (InData[j]) {
      var lnum = Math.floor(InData[j][4]),
        hnum = Math.ceil(InData[j][4]),
        i = 0,
        k = 0;
      while (i < lnum) {
        if (isPrime(lnum)) break;
        i++;
        lnum--;
      }
      while (k < hnum) {
        if (isPrime(hnum)) break;
        k++;
        hnum++;
      }

      if (i > k)
        nearer_prime = hnum;
      else if (i < k)
        nearer_prime = lnum;
      else if (i == k) {
        nearer_prime = InData[j][4];
      }

      PNOres = add(nearer_prime, -InData[j][4]);
      Pdata[l] = [InData[j][0], PNOres.toFixed(2)];
      l++;
      j++;
    }

    return Pdata;
  }
  /*------Prime Numbers Oscillator ends-----*/

  /*----------------------------------------*/
  /*----------Prime Numbers Band------------*/
  /*----------------------------------------*/
  function PNB(InData) {
    var j = 0,
      l = 0,
      nearer_highprime = 0,
      nearer_lowprime = 0,
      PNBhigh_res = [],
      PNBlow_res = [],
      Pdata = [];

    while (InData[j]) {
      var lnum = Math.floor(InData[j][4]),
        hnum = Math.ceil(InData[j][4]),
        i = 0,
        k = 0;

      while (i < lnum) {
        if (isPrime(lnum)) {
          nearer_lowprime = lnum;
          break;
        }
        i++;
        lnum--;
      }

      while (k < hnum) {
        if (isPrime(hnum)) {
          nearer_highprime = hnum
          break;
        }
        k++;
        hnum++;
      }

      PNBhigh_res[l] = [InData[j][0], nearer_highprime];
      PNBlow_res[l] = [InData[j][0], nearer_lowprime];
      l++;
      j++;
    }

    return [PNBhigh_res, PNBlow_res];
  }
  /*-----Prime Numbers Band ends------------*/

  /*----------------------------------------*/
  /*-------Price and Volume Trend-----------*/
  /*----------------------------------------*/
  function PVT(d, InData) {

    var j = 0,
      l = 1,
      i = 0,
      k = 0,
      Pdata = [],
      PVT = [];

    while (InData[j]) {
      var date1 = new Date(InData[j][0]);
      var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
      if (d1 == d) {
        k = 1;
        break;
      }
      j++;
    }

    if (k != 1) {
      alert("Invalid Input");
      return 0;
    }

    j++;
    PVT[0] = 0;

    while (InData[j]) {
      if (InData[j][4] != InData[j - 1][4]) {
        PVT[l] = add(PVT[l - 1], (InData[j][5] * ((add(InData[j][4], -InData[j - 1][4]) / InData[j - 1][4]) * 100)));
      } else {
        PVT[l] = PVT[l - 1];
      }
      Pdata[i] = [InData[j][0], PVT[l]];
      j++;
      l++;
      i++;
    }

    return Pdata;
  }
  /*------Price And Volume Trend ends-------*/

  /*----------------------------------------*/
  /*------------Performance Indicator-------*/
  /*----------------------------------------*/
  function PI(d, InData) {
    var j = 0,
      l = 0,
      k = 0,
      Pdata = [],
      start_price = 0;
    while (InData[j]) {
      var date1 = new Date(InData[j][0]);
      var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
      if (d1 == d) {
        start_price = InData[j][4];
        k = 1;
        break;
      }
      j++;
    }

    if (k != 1) {
      alert("Invalid Input");
      return 0;
    }

    while (InData[j]) {
      var PIres = 0;
      PIres = add(InData[j][4], -start_price);
      Pdata[l] = [InData[j][0], PIres.toFixed(2)];
      l++;
      j++;
    }
    return Pdata;
  }
  /*--------Performance Indicator ends------*/

  /*----------------------------------------*/
  /*---------Chaikin Money Flow-------------*/
  /*----------------------------------------*/
  function CMF(p, InData) {

    var j = p - 1,
      i = 0,
      ADLdata = [],
      MFM = [],
      MFV = [],
      CMFres = 0,
      Cdata = [];

    while (InData[j]) {
      var k = j - p * 1 + 1,
        MFVres = 0,
        Vres = 0;
      while (k <= j) {
        MFM = add(add(InData[k][4], -InData[k][3]), -add(InData[k][2], -InData[k][4])) / add(InData[k][2], -InData[k][3]);
        MFV = MFM * InData[k][5];
        MFVres = add(MFVres, MFV);
        Vres = add(Vres, InData[k][5]);
        k++;
      }
      CMFres = MFVres / Vres;
      Cdata[i] = [InData[j][0], CMFres];
      j++;
      i++;
    }

    return Cdata;
  }
  /*-------Chaikin Money Flow ends----------*/

  /*----------------------------------------*/
  /*-----Accumulation Distribution line-----*/
  /*----------------------------------------*/
  function ADL(d, InData) {

    var j = 0,
      l = 1,
      i = 0,
      k = 0,
      ADLdata = [],
      MFM = 0,
      MFV = 0,
      ADL = [];

    while (InData[j]) {
      var date1 = new Date(InData[j][0]);
      var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
      if (d1 == d) {
        k = 1;
        break;
      }
      j++;
    }

    if (k != 1) {
      alert("Invalid Input");
      return 0;
    }

    ADL[0] = 0;
    while (InData[j]) {
      MFM = add(add(InData[j][4], -InData[j][3]), -add(InData[j][2], -InData[j][4])) / add(InData[j][2], -InData[j][3]);
      MFV = MFM * InData[j][5];
      ADL[l] = add(ADL[l - 1], MFV);
      ADLdata[i] = [InData[j][0], ADL[l]];
      j++;
      l++;
      i++;
    }

    return ADLdata;
  }
  /*--Accumulation Distribution line ends---*/

  /*----------------------------------------*/
  /*--------Chaikin Momentum Oscillator-----*/
  /*----------------------------------------*/
  function CMO(p1, p2, d, InData) {
    var l = 0,
      k = p2 - p1,
      i = 0,
      ADLdata = [],
      short_EMA = [],
      long_EMA = [],
      Cdata = [];
    ADLdata = ADL(d, InData);
    short_EMA = EMA(p1, ADLdata);
    long_EMA = EMA(p2, ADLdata);
    while (short_EMA[k]) {
      var CMOres = 0;
      CMOres = add(short_EMA[k][1], -long_EMA[i][1]);
      Cdata[l] = [long_EMA[i][0], CMOres];
      i++;
      l++;
      k++;
    }
    return Cdata;
  }
  /*----Chaikin Momentum Oscillator ends----*/

  /*----------------------------------------*/
  /*---------On Balance Volume--------------*/
  /*----------------------------------------*/
  function OBV(d, InData) {

    var j = 0,
      l = 1,
      i = 0,
      k = 0,
      OBVdata = [],
      OBV = [];

    while (InData[j]) {
      var date1 = new Date(InData[j][0]);
      var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
      if (d1 == d) {
        k = 1;
        break;
      }
      j++;
    }

    if (k != 1) {
      alert("Invalid Input");
      return 0;
    }

    OBV[0] = 0;
    while (InData[j]) {
      if (InData[j][4] > InData[j - 1][4]) {
        OBV[l] = add(OBV[l - 1], InData[j][5]);
      } else if (InData[j][4] < InData[j - 1][4]) {
        OBV[l] = add(OBV[l - 1], -InData[j][5]);
      } else if (InData[j][4] == InData[j - 1][4]) {
        OBV[l] = OBV[l - 1];
      }
      OBVdata[i] = [InData[j][0], OBV[l]];
      j++;
      l++;
      i++;
    }

    return OBVdata;
  }
  /*-----------On Balance Volume------------*/

  /*----------------------------------------*/
  /*-------Williams Accumulate Distribute---*/
  /*----------------------------------------*/
  function WAD(d, InData) {

    var j = 0,
      l = 1,
      i = 0,
      k = 0,
      Wdata = [],
      AD = [];

    while (InData[j]) {
      var date1 = new Date(InData[j][0]);
      var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
      if (d1 == d) {
        k = 1;
        break;
      }
      j++;
    }
    if (k != 1) {
      alert("Invalid Input");
      return 0;
    }
    j++;
    AD[0] = 0;

    while (InData[j]) {
      if (InData[j][4] > InData[j - 1][4]) {
        AD[l] = add(AD[l - 1], (add(InData[j][4], -Math.min(InData[j][3], InData[j - 1][4]))));
      } else if (InData[j][4] < InData[j - 1][4]) {
        AD[l] = add(AD[l - 1], (add(InData[j][4], -Math.max(InData[j][2], InData[j - 1][4]))));
      } else if (InData[j][4] == InData[j - 1][4]) {
        AD[l] = AD[l - 1];
      }
      Wdata[i] = [InData[j][0], AD[l]];
      j++;
      l++;
      i++;
    }

    return Wdata;
  }
  /*--Williams Accumulate Distribute ends---*/

  /*----------------------------------------*/
  /*----Williams Accumulation Distribution--*/
  /*----------------------------------------*/
  function WADt(d, InData) {

    var j = 0,
      l = 1,
      i = 0,
      k = 0,
      Wdata = [],
      price_move = 0,
      Williams_AD = 0,
      AD = [];

    while (InData[j]) {
      var date1 = new Date(InData[j][0]);
      var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
      if (d1 == d) {
        k = 1;
        break;
      }
      j++;
    }

    if (k != 1) {
      alert("Invalid Input");
      return 0;
    }

    j++;
    AD[0] = 0;

    while (InData[j]) {
      if (InData[j][4] > InData[j - 1][4]) {
        price_move = (add(InData[j][4], -Math.min(InData[j][3], InData[j - 1][4])));
      } else if (InData[j][4] < InData[j - 1][4]) {
        price_move = (add(InData[j][4], -Math.max(InData[j][2], InData[j - 1][4])));
      } else if (InData[j][4] == InData[j - 1][4]) {
        price_move = 0;
      }
      AD[l] = price_move * InData[j][5];
      Williams_AD = AD[l] + AD[l - 1];
      Wdata[i] = [InData[j][0], Williams_AD.toFixed(2)];
      j++;
      l++;
      i++;
    }

    return Wdata;
  }
  /*---Williams Accumulation Distribution ends----*/

  /*----------------------------------------*/
  /*------------ Median Price --------------*/
  /*----------------------------------------*/
  function MP(InData) {
    var j = 0,
      l = 0,
      Mdata = [];

    while (InData[j]) {
      var MPres = 0;
      MPres = add(InData[j][2], InData[j][3]) / 2;
      Mdata[l] = [InData[j][0], MPres.toFixed(2)];
      l++;
      j++;
    }
    return Mdata;
  }
  /*----------- Median Price ends ----------*/

  /*----------------------------------------*/
  /*----Vertical Horizontal Filter----------*/
  /*----------------------------------------*/
  function VHF(p, InData) {
    var j = p,
      l = 0,
      Vdata = [];

    while (InData[j]) {
      var k = j - p * 1 + 1,
        i = 1,
        HCP = [],
        LCP = [],
        Hres = 0,
        Lres = 0,
        denominator = [],
        VHFres = 0;
      HCP[0] = 0;
      LCP[0] = 100000;
      denominator[0] = 0;
      while (k <= j) {
        if (InData[k][4] >= HCP[i - 1]) {
          HCP[i] = InData[k][4];
        } else {
          HCP[i] = HCP[i - 1];
        }
        if (InData[k][4] <= LCP[i - 1]) {
          LCP[i] = InData[k][4];
        } else {
          LCP[i] = LCP[i - 1];
        }
        denominator[i] = add(denominator[i - 1], Math.abs(add(InData[k][4], -InData[k - 1][4])));
        VHFres = (add(HCP[i], -LCP[i])) / denominator[i];
        k++;
        i++;
      }

      Vdata[l] = [InData[j][0], VHFres.toFixed(2)];
      l++;
      j++;
    }
    return Vdata;
  }
  /*----Vertical Horizontal Filter ends-----*/

  /*----------------------------------------*/
  /*------------ Force Index ---------------*/
  /*----------------------------------------*/
  function FI(p, InData) {
    var j = 1,
      l = 0,
      Fdata = [];

    while (InData[j]) {
      var FIres = 0;
      FIres = (add(InData[j][4], -InData[j - 1][4])) * InData[j][5];
      Fdata[l] = [InData[j][0], FIres];
      l++;
      j++;
    }
    Fdata = EMA(p, Fdata)
    return Fdata;
  }
  /*----------Force Index ends--------------*/

  /*----------------------------------------*/
  /*-----Chaikin Volatility Oscillator------*/
  /*----------------------------------------*/
  function CVO(p, InData) {
    var j = 0,
      l = 0,
      CVOdata = [],
      Edata = [],
      EMA1 = [],
      EMA2 = [];

    while (InData[j]) {
      var ema1 = 0;
      ema1 = add(InData[j][2], -InData[j][3]);
      Edata[l] = [InData[j][0], ema1];
      l++;
      j++;
    }

    EMA1 = EMA_mod(p, Edata);
    EMA2 = EMA(p, Edata);

    var k = 0;
    l = 0, j = p;
    while (EMA1[k]) {
      var CVOres = 0;
      CVOres = (add(EMA1[k][1], -EMA2[k][1]) / EMA2[k][1]) * 100;
      CVOdata[l] = [EMA1[k][0], CVOres];
      l++;
      k++;
    }

    //Calculating EMA1
    function EMA_mod(p, InData) {

      var period = p * 1,
        j = 10,
        Edata = [],
        l = 0,
        SMAres = 0,
        p1 = p + p;
      dataIndex = (InData[0].length > 3) ? 4 : 1;

      while (j < p1) {
        SMAres = add(SMAres, InData[j][dataIndex]);
        j++;
      }
      /*Fix for erratic division in JS floats*/
      SMAres = SMAres.toFixed(2) * 1000;
      SMAres = (SMAres / p) / 1000;

      /*EMA = SMA for the first point*/
      Edata[l] = [InData[j - 1][0], SMAres];
      l++;

      var exponent = (2 / (p + 1)).toFixed(3) * 1,
        EMAres,
        inter_A, inter_B, inter_C; /*Intermediate results*/

      while (InData[j]) {
        inter_A = (exponent * InData[j][dataIndex]).toFixed(3) * 1;
        inter_B = (1 - exponent).toFixed(3);
        inter_C = Edata[l - 1][1];

        EMAres = (inter_A + (inter_B * inter_C)).toFixed(3) * 1;
        Edata[l] = [InData[j][0], EMAres.toFixed(2)];
        l++;
        j++;
      }
      return Edata;
    }

    return CVOdata;
  }
  /*--Chaikin Volatility Oscillator ends----*/

  /*----------------------------------------*/
  /*------------ Ease Of Movement-----------*/
  /*----------------------------------------*/
  function EOM(p, InData) {
    var j = 1,
      l = 0,
      Edata = [];

    while (InData[j]) {
      var EOMres = 0,
        mid_point_move = 0,
        box_ratio = 0;
      mid_point_move = (add(InData[j][2], InData[j][3]) / 2) - (add(InData[j - 1][2], InData[j - 1][3]) / 2);
      box_ratio = (InData[j][5] / 10000) / (add(InData[j][2], -InData[j][3]));
      EOMres = mid_point_move / box_ratio;
      Edata[l] = [InData[j][0], EOMres];
      l++;
      j++;
    }
    Edata = SMA(p, Edata)
    return Edata;
  }
  /*------Ease of Movement ends-------------*/

  /*----------------------------------------*/
  /*-----------------ADX--------------------*/
  /*----------------------------------------*/
  function ADX(p, InData) {
    var j = 1,
      l = 0,
      PDM = 0,
      NDM = 0,
      positive_DM = [],
      negative_DM = [],
      positive_DI = 0,
      negative_DI = 0,
      DX = [],
      positive_WMA = [],
      negative_WMA = [],
      ADX_WMA = [],
      TR_WMA = [],
      TR = [];

    while (InData[j]) {
      TR[l] = [InData[j][0], Math.max(Math.abs(add(InData[j][2], -InData[j][3])), Math.abs(add(InData[j][2], -InData[j - 1][4])), Math.abs(add(InData[j][3], -InData[j - 1][4])))];
      if (add(InData[j][2], -InData[j - 1][2]) > add(InData[j - 1][3], -InData[j][3])) {
        PDM = Math.max(add(InData[j][2], -InData[j - 1][2]), 0);
        positive_DM[l] = [InData[j][0], PDM];
      } else {
        positive_DM[l] = [InData[j][0], 0];
      }
      if (add(InData[j][2], -InData[j - 1][2]) < add(InData[j - 1][3], -InData[j][3])) {
        NDM = Math.max(add(InData[j - 1][3], -InData[j][3]), 0);
        negative_DM[l] = [InData[j][0], NDM];
      } else {
        negative_DM[l] = [InData[j][0], 0];
      }
      j++;
      l++;
    }
    positive_WMA = wma(p, positive_DM);
    negative_WMA = wma(p, negative_DM);
    TR_WMA = wma(p, TR);
    var k = 0,
      i = 0;
    while (TR_WMA[k]) {
      positive_DI = (positive_WMA[k][1] / TR_WMA[k][1]) * 100;
      negative_DI = (negative_WMA[k][1] / TR_WMA[k][1]) * 100;
      DX[i] = [TR_WMA[k][0], (Math.abs(add(positive_DI, -negative_DI)) / Math.abs(add(positive_DI, negative_DI))) * 100];
      i++;
      k++;
    }

    // to calculate wma
    function wma(p, InData) {

      var j = 0,
        Wdata = [],
        l = 0,
        SMAres = 0;

      while (j < p) {
        SMAres = add(SMAres, InData[j][1]);
        j++;
      }
      SMAres = SMAres.toFixed(2) * 1000;
      SMAres = (SMAres) / 1000;

      Wdata[l] = [InData[j - 1][0], SMAres];
      l++;

      var WMAres, inter_C;

      while (InData[j]) {
        inter_C = Wdata[l - 1][1];
        WMAres = (InData[j][1] + ((1 - 1 / p) * inter_C));
        Wdata[l] = [InData[j][0], WMAres.toFixed(2)];
        l++;
        j++;
      }
      return Wdata;
    }

    ADX_WMA = WMA(p, DX);
    return ADX_WMA;
  }
  /*-----------------ADX ends---------------*/

  /*----------------------------------------*/
  /*-----------Vortex Indicator-------------*/
  /*----------------------------------------*/
  function VORTEX(p, InData) {
    var j = p - 1,
      l = 0,
      positive_VM = 0,
      negative_VM = 0,
      TR = 0,
      positive_VI = [],
      negative_VI = [],
      Vdata = [];

    while (InData[j]) {
      var k = j - p * 1 + 1,
        sum_TR = 0,
        sum_NVM = 0,
        sum_PVM = 0;
      if (k == 0) k++;
      while (k <= j) {
        positive_VM = add(InData[k][2], -InData[k - 1][3]);
        sum_PVM = add(sum_PVM, positive_VM);
        negative_VM = add(InData[k][3], -InData[k - 1][2]);
        sum_NVM = add(sum_NVM, negative_VM);
        TR = Math.max(Math.abs(add(InData[k][2], -InData[k][3])), Math.abs(add(InData[k][2], -InData[k - 1][4])), Math.abs(add(InData[k][3], -InData[k - 1][4])));
        sum_TR = add(sum_TR, TR);
        k++;
      }
      positive_VI[l] = [InData[j][0], (sum_PVM / sum_TR)];
      negative_VI[l] = [InData[j][0], Math.abs(sum_NVM / sum_TR)];
      j++;
      l++;
    }
    return [positive_VI, negative_VI];
  }
  /*--------Vortex Indicator ends-----------*/

  /*----------------------------------------*/
  /*-------Momentum Oscillator--------------*/
  /*----------------------------------------*/
  function MO(InData) {
    var j = 1,
      l = 0,
      Mdata = [];

    while (InData[j]) {
      var MOres = 0;
      MOres = add(InData[j][4], -InData[j - 1][4]);
      Mdata[l] = [InData[j][0], MOres.toFixed(2)];
      l++;
      j++;
    }
    return Mdata;
  }
  /*-----Momentum Oscillator ends-----------*/

  /*----------------------------------------*/
  /*-----Wilder Moving Average--------------*/
  /*----------------------------------------*/

  function WMA(p, InData) {

    var period = p * 1,
      j = 0,
      Wdata = [],
      l = 0,
      SMAres = 0,
      dataIndex = (InData[0].length > 3) ? 4 : 1;

    while (j < p) {
      SMAres = add(SMAres, InData[j][dataIndex]);
      j++;
    }
    /*Fix for erratic division in JS floats*/
    SMAres = SMAres.toFixed(2) * 1000;
    SMAres = (SMAres / p) / 1000;

    /*WMA = SMA for the first point*/
    Wdata[l] = [InData[j - 1][0], SMAres];
    l++;

    var exponent = (1 / p).toFixed(3) * 1,
      WMAres,
      inter_A, inter_B, inter_C; /*Intermediate results*/

    while (InData[j]) {
      inter_A = (exponent * InData[j][dataIndex]).toFixed(3) * 1;
      inter_B = (1 - exponent).toFixed(3);
      inter_C = Wdata[l - 1][1];

      WMAres = (inter_A + (inter_B * inter_C)).toFixed(3) * 1;
      Wdata[l] = [InData[j][0], WMAres.toFixed(2)];
      l++;
      j++;
    }
    return Wdata;
  }

  /*-----Wilder Moving Average ends---------*/

  /*----------------------------------------*/
  /*------------ EMA------------------------*/
  /*----------------------------------------*/

  function EMA(p, InData) {

    var period = p * 1,
      j = 0,
      Edata = [],
      l = 0,
      SMAres = 0,
      dataIndex = (InData[0].length > 3) ? 4 : 1;

    while (j < p) {
      SMAres = add(SMAres, InData[j][dataIndex]);
      j++;
    }
    /*Fix for erratic division in JS floats*/
    SMAres = SMAres.toFixed(2) * 1000;
    SMAres = (SMAres / p) / 1000;

    /*EMA = SMA for the first point*/
    Edata[l] = [InData[j - 1][0], SMAres];
    l++;

    var exponent = (2 / (p + 1)).toFixed(3) * 1,
      EMAres,
      inter_A, inter_B, inter_C; /*Intermediate results*/

    while (InData[j]) {
      inter_A = (exponent * InData[j][dataIndex]).toFixed(3) * 1;
      inter_B = (1 - exponent).toFixed(3);
      inter_C = Edata[l - 1][1];

      EMAres = (inter_A + (inter_B * inter_C)).toFixed(3) * 1;
      Edata[l] = [InData[j][0], EMAres.toFixed(2)];
      l++;
      j++;
    }
    return Edata;
  }

  /*----------- EMA ends -------------------*/

  /*----------------------------------------*/
  /*---------Bollinger %B-------------------*/
  /*----------------------------------------*/

  function BoB(p, m, InData) {
    var period = p * 1,
      SMAData,
      upperBand = 0,
      lowerBand = 0,
      SdevData = [],
      multiplier = m * 1,
      dataPoints = InData.map(function(i) {
        return i[4] * 1;
      }),
      BBdata = [];

    SMAdata = SMA(p, InData);

    SdevData = std_dev(dataPoints, SMAdata, period);

    var i = 0,
      l = 0,
      k = period - 1;
    while (SMAdata[i]) {
      upperBand = add(SMAdata[i][1], multiplier * SdevData[i]);
      lowerBand = add(SMAdata[i][1], -(1 * multiplier * SdevData[i]));
      Bres = (add(InData[k][4], -lowerBand)) / (add(upperBand, -lowerBand));
      BBdata[l] = [SMAdata[i][0], Bres.toFixed(2)];
      i++;
      l++;
      k++;
    }
    return BBdata;
  }

  /*------------Bollinger %B ends-----------*/

  /*----------------------------------------*/
  /*---------Moving Average Envelope--------*/
  /*----------------------------------------*/

  function MAE(p, perctg, InData) {
    var period = p * 1,
      upperEnvelope = [],
      lowerEnvelope = [],
      SMAdata = SMA(period, InData);

    var i = 0;
    while (SMAdata[i]) {
      upperEnvelope[i] = [SMAdata[i][0], add(SMAdata[i][1], (SMAdata[i][1] * perctg / 100))];
      lowerEnvelope[i] = [SMAdata[i][0], add(SMAdata[i][1], -(SMAdata[i][1] * perctg / 100))];
      i++;
    }
    return [upperEnvelope, SMAdata, lowerEnvelope];
  }

  /*------Moving Average Envelope ends------*/

  /*----------------------------------------*/
  /*------------ Bollinger Bands------------*/
  /*----------------------------------------*/

  function BoBands(p, m, InData) {
    var period = p * 1,
      SMAData,
      upperBand = [],
      lowerBand = [],
      SdevData = [],
      multiplier = m * 1,
      dataPoints = InData.map(function(i) {
        return i[4] * 1;
      }),
      SMAp = p;

    SMAdata = SMA(p, InData);

    SdevData = std_dev(dataPoints, SMAdata, period);

    var i = 0;
    while (SMAdata[i]) {
      upperBand[i] = [SMAdata[i][0], add(SMAdata[i][1], multiplier * SdevData[i]).toFixed(2)];
      lowerBand[i] = [SMAdata[i][0], add(SMAdata[i][1], -1 * multiplier * SdevData[i]).toFixed(2)];
      i++;
    }

    return [upperBand, SMAdata, lowerBand];
  }

  /*---- Standard Deviation --*/
  function std_dev(dataArray, dataSMA, SMAperiod) {
    var j = SMAperiod,
      SDdata = [],
      i = 0,
      interA;
    while (dataSMA[i]) {
      var k = j - SMAperiod;
      SDdata[i] = 0;
      while (k < j) {
        interA = add(dataArray[k], -dataSMA[i][1] * 1);
        SDdata[i] = SDdata[i] + Math.pow(interA, 2);

        k++;
      }

      SDdata[i] = Math.sqrt(SDdata[i] / SMAperiod);

      i++;
      j++;
    }

    return SDdata;
  }


  /*---------- BoBands ends ------------------*/

  /*-----------------------------------------*/
  /*---- Standard Deviation -----------------*/
  /*-----------------------------------------*/
  function SD(p, InData) {
    var j = p,
      Sdata = [],
      SDdata = [],
      i = 0,
      l = 0,
      interA,
      dataArray = InData.map(function(i) {
        return i[4] * 1;
      }),
      dataSMA = SMA(p, InData);

    while (dataSMA[i]) {
      var k = j - p;
      Sdata[i] = 0;
      while (k < j) {
        interA = add(dataArray[k], -dataSMA[i][1] * 1);
        Sdata[i] = Sdata[i] + Math.pow(interA, 2);

        k++;
      }

      Sdata[i] = Math.sqrt(Sdata[i] / p);
      SDdata[l] = [dataSMA[i][0], Sdata[i]];
      i++;
      j++;
      l++;
    }
    return SDdata;
  }
  /*--------- Standard Deviation Ends-------*/

  /*----------------------------------------*/
  /*-------------- PPO----------------------*/
  /*----------------------------------------*/

  function PPO(p1, p2, sp, InData) {
    if (p1 == p2) alert("Both periods are same");
    var period1 = p1,
      period2 = p2,
      Speriod = sp,
      PPOdata = [],
      EMAS = [],
      PPOBAR = [];

    var EMA1 = EMA(period1, InData),
      EMA2 = EMA(period2, InData);

    var tempE = ((period1 * 1) > (period2 * 1)) ? EMA1 : EMA2,
      tempIndex = EMA1.map(function(i) {
        return i[0] * 1;
      }).indexOf(tempE[0][0]);
    EMA1 = EMA1.slice(tempIndex, EMA1.length);

    tempIndex = EMA2.map(function(i) {
      return i[0] * 1;
    }).indexOf(tempE[0][0]);
    EMA2 = EMA2.slice(tempIndex, EMA2.length);

    var i = 0;
    while (EMA1[i]) {
      var PPOres = (add(EMA1[i][1], -EMA2[i][1]) / EMA2[i][1]) * 100;
      PPOdata[i] = [EMA1[i][0], PPOres];
      i++;
    }

    EMAS = EMA(Speriod, PPOdata);

    i = 0;
    while (EMAS[i]) {
      var Pperiod = i + Speriod * 1 - 1;
      var BARres = add(PPOdata[Pperiod][1], -EMAS[i][1]);
      PPOBAR[i] = [EMAS[i][0], BARres];
      i++;
    }
    return [PPOdata, EMAS, PPOBAR];
  }
  /*---------------PPO ends-----------------*/

  /*----------------------------------------*/
  /*-------------- PVO ---------------------*/
  /*----------------------------------------*/

  function PVO(p1, p2, sp, InData) {
    if (p1 == p2) alert("Both periods are same");
    var period1 = p1,
      period2 = p2,
      Speriod = sp,
      PVOdata = [],
      EMAS = [],
      PVOBAR = [];
    var j = 0,
      l = 0,
      Pdata = [];

    while (InData[j]) {
      Pdata[l] = [InData[j][0], InData[j][5]];
      l++;
      j++;
    }

    var EMA1 = EMA(period1, Pdata),
      EMA2 = EMA(period2, Pdata);

    var tempE = ((period1 * 1) > (period2 * 1)) ? EMA1 : EMA2,
      tempIndex = EMA1.map(function(i) {
        return i[0] * 1;
      }).indexOf(tempE[0][0]);
    EMA1 = EMA1.slice(tempIndex, EMA1.length);

    tempIndex = EMA2.map(function(i) {
      return i[0] * 1;
    }).indexOf(tempE[0][0]);
    EMA2 = EMA2.slice(tempIndex, EMA2.length);

    var i = 0;
    while (EMA1[i]) {
      var PVOres = (add(EMA1[i][1], -EMA2[i][1]) / EMA2[i][1]) * 100;
      PVOdata[i] = [EMA1[i][0], PVOres];
      i++;
    }

    EMAS = EMA(Speriod, PVOdata);

    i = 0;
    while (EMAS[i]) {
      var Pperiod = i + Speriod * 1 - 1;
      var BARres = add(PVOdata[Pperiod][1], -EMAS[i][1]);
      PVOBAR[i] = [EMAS[i][0], BARres];
      i++;
    }
    return [PVOdata, EMAS, PVOBAR];
  }
  /*---------------PVO ends-----------------*/

  /*----------------------------------------*/
  /*----------- Price Oscillator------------*/
  /*----------------------------------------*/

  function PO(p1, p2, InData) {
    if (p1 == p2) alert("Both periods are same");
    var period1 = p1,
      period2 = p2,
      POdata = [];

    var EMA1 = EMA(period1, InData),
      EMA2 = EMA(period2, InData);

    var tempE = ((period1 * 1) > (period2 * 1)) ? EMA1 : EMA2,
      tempIndex = EMA1.map(function(i) {
        return i[0] * 1;
      }).indexOf(tempE[0][0]);
    EMA1 = EMA1.slice(tempIndex, EMA1.length);

    tempIndex = EMA2.map(function(i) {
      return i[0] * 1;
    }).indexOf(tempE[0][0]);
    EMA2 = EMA2.slice(tempIndex, EMA2.length);

    var i = 0;
    while (EMA1[i]) {
      var POres = add(EMA1[i][1], -EMA2[i][1]);
      POdata[i] = [EMA1[i][0], POres];
      i++;
    }

    return POdata;
  }
  /*-------Price Oscillator ends------------*/

  /*----------------------------------------*/
  /*-------Volume Oscillator----------------*/
  /*----------------------------------------*/

  function VO(p1, p2, InData) {
    if (p1 == p2) alert("Both periods are same");
    var period1 = p1,
      period2 = p2,
      VOdata = [];
    var j = 0,
      l = 0,
      Vdata = [];

    while (InData[j]) {
      Vdata[l] = [InData[j][0], InData[j][5]];
      l++;
      j++;
    }

    var EMA1 = EMA(period1, Vdata),
      EMA2 = EMA(period2, Vdata);

    var tempE = ((period1 * 1) > (period2 * 1)) ? EMA1 : EMA2,
      tempIndex = EMA1.map(function(i) {
        return i[0] * 1;
      }).indexOf(tempE[0][0]);
    EMA1 = EMA1.slice(tempIndex, EMA1.length);

    tempIndex = EMA2.map(function(i) {
      return i[0] * 1;
    }).indexOf(tempE[0][0]);
    EMA2 = EMA2.slice(tempIndex, EMA2.length);

    var i = 0;
    while (EMA1[i]) {
      var VOres = add(EMA1[i][1], -EMA2[i][1]);
      VOdata[i] = [EMA1[i][0], VOres];
      i++;
    }

    return VOdata;
  }
  /*------Volume Oscillator ends------------*/

  /*----------------------------------------*/
  /*-------------- MACD---------------------*/
  /*----------------------------------------*/

  function MACD(p1, p2, sp, InData) {
    if (p1 == p2) alert("Both periods are same");
    var period1 = p1,
      period2 = p2,
      Speriod = sp,
      MACDdata = [],
      EMAS = [],
      MACDBAR = [];

    var EMA1 = EMA(period1, InData),
      EMA2 = EMA(period2, InData);

    var tempE = ((period1 * 1) > (period2 * 1)) ? EMA1 : EMA2,
      tempIndex = EMA1.map(function(i) {
        return i[0] * 1;
      }).indexOf(tempE[0][0]);
    EMA1 = EMA1.slice(tempIndex, EMA1.length);

    tempIndex = EMA2.map(function(i) {
      return i[0] * 1;
    }).indexOf(tempE[0][0]);
    EMA2 = EMA2.slice(tempIndex, EMA2.length);

    //MACD line
    var i = 0;
    while (EMA1[i]) {
      var MACDres = add(EMA1[i][1], -EMA2[i][1]);
      MACDdata[i] = [EMA1[i][0], MACDres];
      i++;
    }
    // Signal line
    EMAS = EMA_Signal(Speriod, MACDdata);
    //Histogram - Bar Chart    
    i = 0;
    while (EMAS[i]) {
      var Mperiod = i + Speriod * 1 - 1;
      var BARres = add(MACDdata[Mperiod][1], -EMAS[i][1]);
      MACDBAR[i] = [EMAS[i][0], BARres];
      i++;
    }

    //EMA SIGNAL
    function EMA_Signal(period1, InData) {

      var period = period1 * 1,
        j = 0,
        Edata = [],
        l = 0,
        SMAres = 0;
      while (j < period) {
        SMAres = add(SMAres, InData[j][1]);
        j++;
      }

      SMAres = SMAres.toFixed(2) * 1000;
      SMAres = (SMAres / period) / 1000;

      //EMA = SMA for the first point
      Edata[l] = [InData[j - 1][0], SMAres];
      l++;

      var exponent = (2 / (period + 1)).toFixed(3) * 1,
        EMAres,
        inter_A, inter_B, inter_C;

      while (InData[j]) {
        inter_A = (exponent * InData[j][1]).toFixed(3) * 1;
        inter_B = (1 - exponent).toFixed(3);
        inter_C = Edata[l - 1][1];

        EMAres = (inter_A + (inter_B * inter_C)).toFixed(3) * 1;
        Edata[l] = [InData[j][0], EMAres.toFixed(2) * 1];
        l++;
        j++;
      }
      return Edata;
    }

    return [MACDdata, EMAS, MACDBAR];
  }

  /*-------------MACD ends------------------*/

  /*----------------------------------------*/
  /*------------ATR SMA---------------------*/
  /*----------------------------------------*/
  function ATR_SMA(p, InData) {
    var interM = [];

    var i = 0;
    while (InData[i + 1]) {
      var high = InData[i + 1][2] * 1,
        low = InData[i + 1][3] * 1,
        Pclose = InData[i][4] * 1,
        high_low = Math.abs(add(high, -low)),
        high_close = Math.abs(add(high, -Pclose)),
        close_low = Math.abs(add(Pclose, -low));

      interM[i] = [InData[i + 1][0], Math.max(high_low, high_close, close_low)];

      i++;
    }

    var ATRdata = SMA(p, interM);

    return ATRdata;
  }

  /*------------ATR SMA ends----------------*/

  /*----------------------------------------*/
  /*------------ATR EMA---------------------*/
  /*----------------------------------------*/
  function ATR_EMA(p, InData) {
    var interM = [];

    var i = 0;
    while (InData[i + 1]) {
      var high = InData[i + 1][2] * 1,
        low = InData[i + 1][3] * 1,
        Pclose = InData[i][4] * 1,
        high_low = Math.abs(add(high, -low)),
        high_close = Math.abs(add(high, -Pclose)),
        close_low = Math.abs(add(Pclose, -low));

      interM[i] = [InData[i + 1][0], Math.max(high_low, high_close, close_low)];

      i++;
    }

    var ATRdata = EMA(p, interM);
    return ATRdata;
  }

  /*------------ATR EMA ends----------------*/

  /*----------------------------------------*/
  /*------------ATR WMA---------------------*/
  /*----------------------------------------*/
  function ATR_WMA(p, InData) {
    var interM = [];

    var i = 0;
    while (InData[i + 1]) {
      var high = InData[i + 1][2] * 1,
        low = InData[i + 1][3] * 1,
        Pclose = InData[i][4] * 1,
        high_low = Math.abs(add(high, -low)),
        high_close = Math.abs(add(high, -Pclose)),
        close_low = Math.abs(add(Pclose, -low));

      interM[i] = [InData[i + 1][0], Math.max(high_low, high_close, close_low)];

      i++;
    }

    var ATRdata = WMA(p, interM);

    return ATRdata;
  }

  /*------------ATR WMA ends-----------------*/

  /*----------------------------------------*/
  /*------Ultimate Oscillator---------------*/
  /*----------------------------------------*/
  function UO(p1, p2, p3, InData) {
    var BP = 0,
      TR = 0,
      l = 0,
      BP_list = [],
      TR_list = [],
      UOdata = [];
    var i = 1;
    while (InData[i]) {
      BP = InData[i][4] - Math.min(InData[i][3], InData[i - 1][4]),
      TR = Math.max(InData[i][2], InData[i - 1][4]) - Math.min(InData[i][3], InData[i - 1][4]);
      BP_list[l] = [InData[i][0], BP];
      TR_list[l] = [InData[i][0], TR];
      i++;
      l++;
    }
    var BP_sum1 = SMA(p1, BP_list),
      TR_sum1 = SMA(p1, TR_list),
      BP_sum2 = SMA(p2, BP_list),
      TR_sum2 = SMA(p2, TR_list),
      BP_sum3 = SMA(p3, BP_list),
      TR_sum3 = SMA(p3, TR_list),
      Avg1 = [],
      Avg2 = [],
      Avg3 = [],
      k = 0,
      res1 = 0,
      res2 = 0,
      res3 = 0,
      fres = 0;
    while (BP_sum1[k] && TR_sum1[k]) {
      res1 = BP_sum1[k][1] / TR_sum1[k][1];
      Avg1[k] = [BP_sum1[k][0], res1];
      k++;
    }
    k = 0;
    while (BP_sum2[k] && TR_sum2[k]) {
      res2 = BP_sum2[k][1] / TR_sum2[k][1];
      Avg2[k] = [BP_sum2[k][0], res2];
      k++;
    }
    k = 0;
    while (BP_sum3[k] && TR_sum3[k]) {
      res3 = BP_sum3[k][1] / TR_sum3[k][1];
      Avg3[k] = [BP_sum3[k][0], res3];
      k++;
    }
    k = 0, l = 0, m = p3 - p1;
    n = p3 - p2;
    while (Avg3[k]) {
      fres = 100 * ((add((4 * Avg1[m][1]), (2 * Avg2[n][1]), Avg3[k][1])) / p1);
      UOdata[l] = [Avg3[k][0], fres.toFixed(2)];
      k++;
      l++;
      m++;
      n++;
    }
    return UOdata;
  }

  /*-----Ulimate Oscillator ends------------*/

  /*----------------------------------------*/
  /*-----Fast Stochastic Oscillator---------*/
  /*----------------------------------------*/

  function FSO(p, sp, InData) {
    var fastK = [],
      period = p * 1 - 1,
      highestHigh,
      lowestLow;

    for (var i = period; i < InData.length; i++) {

      highestHigh = InData[i][2];
      lowestLow = InData[i][3];

      for (var j = 0; j <= period; j++) {

        highestHigh = (highestHigh > InData[i - j][2]) ? highestHigh : InData[i - j][2];
        lowestLow = (lowestLow < InData[i - j][3]) ? lowestLow : InData[i - j][3];

      }

      var numerator = add(InData[i][4], -lowestLow),
        denominator = add(highestHigh - lowestLow);

      fastK[i - period] = [InData[i][0], ((numerator / denominator) * 100).toFixed(2)];
    }

    var fastD = SMA(p, fastK);

    return [fastK, fastD];
  }

  /*------------FSO ends--------------------*/

  /*----------------------------------------*/
  /*-----Slow Stochastic Oscillator---------*/
  /*----------------------------------------*/

  function SSO(p1, p2, sp, InData) {

    var FSOdata = FSO(p1, p2, InData),
      slowK = FSOdata[1];

    var slowD = SMA(sp, slowK);

    return [slowK, slowD];
  }

  /*------------SSO ends--------------------*/

  /*----------------------------------------*/
  /*--------------- K D J ------------------*/
  /*----------------------------------------*/

  function KDJ(p, sp, InData) {
    var fastK = [],
      period = p * 1 - 1,
      highestHigh,
      lowestLow;

    for (var i = period; i < InData.length; i++) {

      highestHigh = InData[i][2];
      lowestLow = InData[i][3];

      for (var j = 0; j <= period; j++) {

        highestHigh = (highestHigh > InData[i - j][2]) ? highestHigh : InData[i - j][2];
        lowestLow = (lowestLow < InData[i - j][3]) ? lowestLow : InData[i - j][3];

      }

      var numerator = add(InData[i][4], -lowestLow),
        denominator = add(highestHigh - lowestLow);

      fastK[i - period] = [InData[i][0], ((numerator / denominator) * 100).toFixed(2)];
    }

    var fastD = SMA(sp, fastK);

    var fastJ = [];
    for (var i = 0; i < fastD.length; i++) {
      fastJ[i] = [fastD[i][0], ((3 * fastD[i][1]) - (2 * fastK[i + (sp * 1 - 1)][1])).toFixed(2) * 1];
    }
    return [fastK, fastD, fastJ];
  }

  /*------------KDJ ends--------------------*/

  /*----------------------------------------*/
  /*------------ William R -----------------*/
  /*----------------------------------------*/
  function williamR(p, InData) {
    var period = p * 1 - 1,
      highestHigh,
      lowestLow,
      WR = [];

    for (var i = period; i < InData.length; i++) {
      highestHigh = InData[i][2];
      lowestLow = InData[i][3];

      for (var j = 0; j <= period; j++) {
        highestHigh = (highestHigh > InData[i - j][2]) ? highestHigh : InData[i - j][2];
        lowestLow = (lowestLow < InData[i - j][3]) ? lowestLow : InData[i - j][3];
      }

      var numerator = (highestHigh - InData[i][4]),
        denominator = (highestHigh - lowestLow);

      WR[i - period] = [InData[i][0], ((numerator / denominator) * -100).toFixed(2)];
    }

    return WR;
  }

  /*------------WR ends---------------------*/

  /*----------------------------------------*/
  /*-------------- CCI ---------------------*/
  /*----------------------------------------*/
  function CCI(p, InData) {
    var TP = [],
      CCIdata = [],
      period = p * 1 - 1;

    for (var i = 0; i < InData.length; i++) {

      var inter1 = add(InData[i][2], InData[i][3]),
        inter2 = add(InData[i][4], inter1);

      TP[i] = [InData[i][0], inter2 / 3];
    }

    var TP_SMA = SMA(p, TP);

    for (var i = period; i < InData.length; i++) {
      var temp = 0;
      for (var j = 0; j <= period; j++) {
        temp = add(temp, Math.abs(add(TP[i - j][1], -TP_SMA[i - period][1])));
      }
      var Mean = ((temp * 1000 / (period + 1)) / 1000).toFixed(2);
      var temp1 = add(TP[i][1], -TP_SMA[i - period][1]),
        temp2 = (0.015 * Mean).toFixed(2) * 1;
      CCIdata[i - period] = [InData[i][0], ((temp1 * 100) / (temp2 * 100)).toFixed(2) * 1];
    }
    return CCIdata;
  }

  /*------------CCI ends--------------------*/

  /*----------------------------------------*/
  /*-------------- ROC-Price----------------*/
  /*----------------------------------------*/

  function ROC(p, InData) {
    var period = p * 1,
      ROCdata = [];

    for (var i = period; i < InData.length; i++) {
      var temp = add(InData[i][4], -InData[i - period][4]);
      ROCdata[i - period] = [InData[i][0], ((temp / InData[i - period][4]) * 100).toFixed(2)];
    }

    return ROCdata;
  }

  /*------------ROC-Price ends--------------*/

  /*----------------------------------------*/
  /*-------------- ROC-Volume----------------*/
  /*----------------------------------------*/

  function ROCV(p, InData) {
    var period = p * 1,
      ROCVdata = [];

    for (var i = period; i < InData.length; i++) {
      var temp = add(InData[i][5], -InData[i - period][5]);
      ROCVdata[i - period] = [InData[i][0], ((temp / InData[i - period][5]) * 100).toFixed(2)];
    }
    return ROCVdata;
  }

  /*------------ROC-Volume ends--------------*/

  /*----------------------------------------*/
  /*-------------- TRIX --------------------*/
  /*----------------------------------------*/

  function TRIX(p, sp, InData) {
    var period = p * 1 - 1,
      TRIXdata = [];

    var EMA1 = EMA(p, InData),
      EMA2 = EMA(p, EMA1),
      EMA3 = EMA(p, EMA2);

    for (var i = 0; i < EMA3.length - 1; i++) {
      var temp = ((add(EMA3[i + 1][1], -EMA3[i][1])) / EMA3[i][1]) * 100;
      TRIXdata[i] = [InData[i + 1 + (period * 3)][0], temp.toFixed(2)];
    }

    var T_Signal = EMA(sp, TRIXdata);

    return [TRIXdata, T_Signal];
  }

  /*------------ TRIX ends -----------------*/

  /*----------------------------------------*/
  /*-------------- TRIX --------------------*/
  /*----------------------------------------*/

  function RSI(p, InData) {
    var period = p * 1,
      gain = [],
      loss = [],
      RSIvalues = [],
      avGain = 0,
      avLoss = 0;

    /*allValues -
     *     0 : Gain
     *         1 : Loss
     *             2 : AverageGain
     *                 3 : AverageLoss
     *                     */
    for (var i = 0; i < InData.length - 1; i++) {
      /*Storing GAIN and LOSS*/
      var gainLoss = add(InData[i + 1][4] - InData[i][4]).toFixed(2) * 1;
      if (gainLoss > 0) {
        gain[i] = gainLoss;
        loss[i] = 0;
      } else if (gainLoss < 0) {
        gain[i] = 0;
        loss[i] = -gainLoss;
      } else {
        gain[i] = 0;
        loss[i] = 0;
      }

      /*Calculating Average Values
       *
       *               First Average Values*/
      if (i == period - 1) {

        for (var j = 0; j < period; j++) {
          avGain = add(avGain, gain[i - j]);
          avLoss = add(avLoss, loss[i - j]);
        }

        avGain = (avGain / period).toFixed(2);
        avLoss = (avLoss / period).toFixed(2);

        if (avLoss == 0) {
          RSIvalues[i - period + 1] = [InData[i + 1][0], 100];
        } else {
          var RS = (avGain / avLoss).toFixed(2) * 1;

          var rsi_temp1 = 1 + RS,
            rsi_temp2 = (100 * 100) / (rsi_temp1 * 100),
            rsi_temp3 = 100 - rsi_temp2;

          RSIvalues[i - period + 1] = [InData[i + 1][0], rsi_temp3.toFixed(2) * 1];
        }
      }

      /*Rest entire list*/
      if (i >= period) {

        /*Previous Average Gain * (1-1/n)*/
        var avGainInter1 = (avGain) * (1 - 1 / period),
          /*Gain[i] * (1/n)*/
          avGainInter2 = gain[i] * (1 / period);
        /*Average Gain*/
        avGain = add(avGainInter2, avGainInter1);

        /*Previous Average Loss * (1-1/n)*/
        var avLossInter1 = avLoss * (1 - 1 / period),
          /*Loss[i] * (1/n) */
          avLossInter2 = loss[i] * (1 / period);
        /*Average Loss*/
        avLoss = add(avLossInter2, avLossInter1);

        var RS = avGain / avLoss;

        RSIvalues[i - period + 1] = [InData[i + 1][0], add(100, -100 / (1 + RS)).toFixed(2) * 1];

      }
    }
    return RSIvalues;
  }

  /*------------ RSI ends -----------------*/

  /*----------------------------------------*/
  /*------------Typical Price --------------*/
  /*----------------------------------------*/
  function TP(InData) {
    var i = 0,
      l = 0,
      Tdata = [];

    while (InData[i]) {
      var TPres = 0;
      TPres = add(add(InData[i][2], InData[i][3]), InData[i][4]) / 3;
      Tdata[l] = [InData[i][0], TPres.toFixed(2)];
      l++;
      i++;
    }
    return Tdata;
  }
  /*-----------Typical Price ends-----------*/

  /*----------------------------------------*/
  /*------------Weighted Close --------------*/
  /*----------------------------------------*/
  function WC(InData) {
    var i = 0,
      l = 0,
      Wdata = [];

    while (InData[i]) {
      var WCres = 0;
      WCres = add(add(InData[i][2], InData[i][3]), (InData[i][4] * 2)) / 4;
      Wdata[l] = [InData[i][0], WCres.toFixed(2)];
      l++;
      i++;
    }
    return Wdata;
  }
  /*----------Weighted Close ends-----------*/

  /*----------------------------------------*/
  /*-------------- MFI  --------------------*/
  /*----------------------------------------*/

  function MFI(p, InData) {
    var period = p * 1,
      TP = [],
      PMF = [],
      /*Positive Money Flow*/
      NMF = [],
      /*Negative Money Flow*/
      MFR = 0,
      /*Money Flow Ratio*/
      MFIvalues = [];

    TP[0] = add(add(InData[0][2], InData[0][3]), InData[0][4]);

    for (var i = 1; i < InData.length - 1; i++) {
      /* Typical Price = (High+Low+Close)/3 */
      TP[i] = add(add(InData[i][2], InData[i][3]), InData[i][4]);
      TP[i] = TP[i] / 3;
      /* Raw Money Flow = TP*Volume */
      var RMF = TP[i] * InData[i][5];
      if ((TP[i] - TP[i - 1]) > 0) {
        PMF[i] = RMF;
        NMF[i] = 0;
      } else {
        NMF[i] = RMF;
        PMF[i] = 0;
      }

      if (i >= period - 1) {
        var totalPMF = 0,
          totalNMF = 0;
        for (var j = 0; j < period; j++) {
          totalPMF = totalPMF + PMF[i - j];
          totalNMF = totalNMF + NMF[i - j];
        }
        MFR = totalPMF / totalNMF;
        var MFItemp = add(100, -(100 / (1 + MFR))).toFixed(2) * 1;
        MFIvalues[i - period] = [InData[i][0], MFItemp];
      }
    }
    return MFIvalues;
  }

  /*------------ MFI ends -----------------*/


  var s = chart.data.Series;
  for (i in s) {

    /*---------------Adding support for Simple Moving Average--------*/
    s[i]['sma'] = function(p) {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var SMA_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " SMA " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#0aa",
        "showInLegend": true,
        "datatype": "TP",
        "data": SMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(SMA_series.id);
      chart.data.Series.push(SMA_series);
      return returnVar;
    }
    /*-----------------------------------------------------------------*/

    /*---------------Adding support for Weighted Moving Average--------*/
    s[i]['wgtma'] = function(p) {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var SMA_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " WgtMA " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#0aa",
        "showInLegend": true,
        "datatype": "TP",
        "data": WgtMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(SMA_series.id);
      chart.data.Series.push(SMA_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Median Price-----------------*/
    s[i]['mp'] = function() {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var MP_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MP ",
        "type": "line",
        "lineWidth": 2,
        "color": "#0aa",
        "showInLegend": true,
        "datatype": "TP",
        "data": MP(this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(MP_series.id);
      chart.data.Series.push(MP_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Typical Price----------------*/
    s[i]['tp'] = function() {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var TP_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " TP ",
        "type": "line",
        "lineWidth": 2,
        "color": "#0aa",
        "showInLegend": true,
        "datatype": "TP",
        "data": TP(this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(TP_series.id);
      chart.data.Series.push(TP_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Weighted Close---------------*/
    s[i]['wc'] = function() {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var WC_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " WC ",
        "type": "line",
        "lineWidth": 2,
        "color": "#0aa",
        "showInLegend": true,
        "datatype": "TP",
        "data": WC(this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(WC_series.id);
      chart.data.Series.push(WC_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Double-EMA ------------------*/
    s[i]['dema'] = function(p) {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var DEMA_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " DEMA " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#0aa",
        "showInLegend": true,
        "datatype": "TP",
        "data": DEMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(DEMA_series.id);
      chart.data.Series.push(DEMA_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Triple-EMA ------------------*/
    s[i]['tema'] = function(p) {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var TEMA_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " TEMA " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#0aa",
        "showInLegend": true,
        "datatype": "TP",
        "data": TEMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(TEMA_series.id);
      chart.data.Series.push(TEMA_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Prime Numbers Band-----------*/
    s[i]['pnb'] = function() {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var PNBhigh_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PNB_high ",
        "type": "line",
        "lineWidth": 2,
        "color": "#0aa",
        "showInLegend": true,
        "datatype": "TP",
        "data": PNB(this.data)[0],
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(PNBhigh_series.id);
      chart.data.Series.push(PNBhigh_series);

      var PNBlow_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PNB_low ",
        "type": "line",
        "lineWidth": 2,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": PNB(this.data)[1],
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(PNBlow_series.id);
      chart.data.Series.push(PNBlow_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-----------------Adding support for ADX------------------------*/
    s[i]['adx'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var ADX_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "ADX",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(ADX_axis.id);
      chart.data.YAxis.push(ADX_axis);

      var ADX_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " ADX " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ADX(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(ADX_series.id);
      chart.data.Series.push(ADX_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*--------------Adding support for Mass Index--------------------*/
    s[i]['mi'] = function(p1, p2, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var MI_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "MI",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(MI_axis.id);
      chart.data.YAxis.push(MI_axis);

      var MI_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MI " + p1 + "," + p2,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": MI(p1, p2, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(MI_series.id);
      chart.data.Series.push(MI_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-----------Adding support for Vortex Indicator ----------------*/
    s[i]['vortex'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var VORTEX_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "VORTEX",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(VORTEX_axis.id);
      chart.data.YAxis.push(VORTEX_axis);

      var VORTEXP_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " VORTEX+ " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": VORTEX(p, this.data)[0],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(VORTEXP_series.id);
      chart.data.Series.push(VORTEXP_series);

      var VORTEXN_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " VORTEX- " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#a0a",
        "showInLegend": true,
        "datatype": "TP",
        "data": VORTEX(p, this.data)[1],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(VORTEXN_series.id);
      chart.data.Series.push(VORTEXN_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*------Adding support for Positive Volume Index ----------------*/
    s[i]['pvi'] = function(d, attr) {

      if (!PVI(d, this.data)) {
        return 0;
      }

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var PVI_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "PVI",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(PVI_axis.id);
      chart.data.YAxis.push(PVI_axis);

      var PVI_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PVI ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": PVI(d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(PVI_series.id);
      chart.data.Series.push(PVI_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*------Adding support for Negative Volume Index ----------------*/
    s[i]['nvi'] = function(d, attr) {

      if (!NVI(d, this.data)) {
        return 0;
      }

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;
      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var NVI_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "NVI",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(NVI_axis.id);
      chart.data.YAxis.push(NVI_axis);

      var NVI_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " NVI ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": NVI(d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(NVI_series.id);
      chart.data.Series.push(NVI_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*------Adding support for Chaikin Volatility  Oscillator--------*/
    s[i]['cvo'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var CVO_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "CVO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(CVO_axis.id);
      chart.data.YAxis.push(CVO_axis);

      var CVO_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " CVO " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": CVO(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(CVO_series.id);
      chart.data.Series.push(CVO_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*------Adding support for Prime Numbers Oscillator--------------*/
    s[i]['pno'] = function(attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var PNO_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "PNO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(PNO_axis.id);
      chart.data.YAxis.push(PNO_axis);

      var PNO_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PNO ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": PNO(this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(PNO_series.id);
      chart.data.Series.push(PNO_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*----------------------------------------------------------------*/

    /*------Adding support for Chaikin Momentum Oscillator------------*/
    s[i]['cmo'] = function(p1, p2, d, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var CMO_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "CMO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(CMO_axis.id);
      chart.data.YAxis.push(CMO_axis);

      var CMO_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " CMO " + p1 + "," + p2,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": CMO(p1, p2, d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(CMO_series.id);
      chart.data.Series.push(CMO_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*------Adding support for Vertical Horizontal Filter------------*/
    s[i]['vhf'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var VHF_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "VHF",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(VHF_axis.id);
      chart.data.YAxis.push(VHF_axis);

      var VHF_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " VHF " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": VHF(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(VHF_series.id);
      chart.data.Series.push(VHF_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*------------Adding support for On Balance Volume---------------*/
    s[i]['obv'] = function(d, attr) {

      if (!OBV(d, this.data)) {
        return 0;
      }

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var OBV_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "OBV",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(OBV_axis.id);
      chart.data.YAxis.push(OBV_axis);

      var OBV_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " OBV ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": OBV(d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(OBV_series.id);
      chart.data.Series.push(OBV_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*------------------------------------------------------------------*/

    /*------Adding support for Accumulation Distribution Line-----------*/
    s[i]['adl'] = function(d, attr) {
      if (!ADL(d, this.data)) {
        return 0;
      }

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var ADL_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "ADL",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(ADL_axis.id);
      chart.data.YAxis.push(ADL_axis);

      var ADL_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " ADL ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ADL(d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(ADL_series.id);
      chart.data.Series.push(ADL_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*------------------------------------------------------------------*/

    /*------------Adding support for Price and Volume Trend-------------*/
    s[i]['pvt'] = function(d, attr) {
      if (!NVI(d, this.data)) {
        return 0;
      }

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var PVT_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "PVT",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(PVT_axis.id);
      chart.data.YAxis.push(PVT_axis);

      var PVT_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PVT ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": PVT(d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(PVT_series.id);
      chart.data.Series.push(PVT_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*------------------------------------------------------------------*/

    /*-------Adding support for William Accumlation Distribution--------*/
    s[i]['wadt'] = function(d, attr) {

      if (!WADt(d, this.data)) {
        return 0;
      }

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var WADt_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "WADt",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(WADt_axis.id);
      chart.data.YAxis.push(WADt_axis);

      var WADt_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " WADt ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": WADt(d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(WADt_series.id);
      chart.data.Series.push(WADt_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-------Adding support for William Accumlate Distribute---------*/
    s[i]['wad'] = function(d, attr) {

      if (!WAD(d, this.data)) {
        return 0;
      }

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var WAD_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "WAD",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(WAD_axis.id);
      chart.data.YAxis.push(WAD_axis);

      var WAD_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " WAD ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": WAD(d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(WAD_series.id);
      chart.data.Series.push(WAD_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Performance Indicator--------*/
    s[i]['pi'] = function(d, attr) {
      if (!PI(d, this.data)) {
        return 0;
      }

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var PI_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "PI",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(PI_axis.id);
      chart.data.YAxis.push(PI_axis);

      var PI_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PI ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": PI(d, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(PI_series.id);
      chart.data.Series.push(PI_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*-----------------------------------------------------------*/

    /*---------------Adding support for Bollinger %B-------------*/
    s[i]['bo%b'] = function(p, m, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var BB_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "Bo%B",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(BB_axis.id);
      chart.data.YAxis.push(BB_axis);

      var BB_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " Bo%B " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": BoB(p, m, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(BB_series.id);
      chart.data.Series.push(BB_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*------------------------------------------------------------*/

    /*---------------Adding support for Chaikin Money Flow--------*/
    s[i]['cmf'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var CMF_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "CMF",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(CMF_axis.id);
      chart.data.YAxis.push(CMF_axis);

      var CMF_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " CMF " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": CMF(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(CMF_series.id);
      chart.data.Series.push(CMF_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*------------------------------------------------------------------*/

    /*---------------Adding support for Standard Deviation--------------*/
    s[i]['sd'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var SD_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "SD",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(SD_axis.id);
      chart.data.YAxis.push(SD_axis);

      var SD_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " SD " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": SD(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(SD_series.id);
      chart.data.Series.push(SD_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*-------------------------------------------------------------*/

    /*---------------Adding support for Momentum Oscillator--------*/
    s[i]['mo'] = function(attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var MO_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "MO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(MO_axis.id);
      chart.data.YAxis.push(MO_axis);

      var MO_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MO ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": MO(this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(MO_series.id);
      chart.data.Series.push(MO_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*--------------------------------------------------------*/

    /*---------------Adding support for High Minus Low--------*/
    s[i]['hml'] = function(attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var HML_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "HML",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(HML_axis.id);
      chart.data.YAxis.push(HML_axis);

      var HML_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " HML ",
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": HML(this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(HML_series.id);
      chart.data.Series.push(HML_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Ultimate Oscillator----------*/
    s[i]['uo'] = function(p1, p2, p3, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var UO_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "UO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(UO_axis.id);
      chart.data.YAxis.push(UO_axis);

      var UO_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + "UO" + p1 + "," + p2 + "," + p3,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": UO(p1, p2, p3, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(UO_series.id);
      chart.data.Series.push(UO_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Ease Of Movement-------------*/
    s[i]['eom'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var EOM_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "EOM",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(EOM_axis.id);
      chart.data.YAxis.push(EOM_axis);

      var EOM_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + "EOM" + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": EOM(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(EOM_series.id);
      chart.data.Series.push(EOM_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Price Oscillator-------------*/
    s[i]['po'] = function(p1, p2, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var PO_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "PO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(PO_axis.id);
      chart.data.YAxis.push(PO_axis);

      var PO_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + "PO" + p1 + "," + p2,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": PO(p1, p2, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(PO_series.id);
      chart.data.Series.push(PO_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*---------------------------------------------------------------*/

    /*---------------Adding support for Volume Oscillator------------*/
    s[i]['vo'] = function(p1, p2, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var VO_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "VO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(VO_axis.id);
      chart.data.YAxis.push(VO_axis);

      var VO_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + "VO" + p1 + "," + p2,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": VO(p1, p2, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(VO_series.id);
      chart.data.Series.push(VO_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;
      return returnVar;

    }
    /*---------------------------------------------------------------*/

    /*----------------Adding support for Force Index-----------------*/
    s[i]['fi'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var FI_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "FI",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(FI_axis.id);
      chart.data.YAxis.push(FI_axis);

      var FI_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " FI " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": FI(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(FI_series.id);
      chart.data.Series.push(FI_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;

    }
    /*--------------------------------------------------------------------*/

    /*----------Adding support for Exponential Moving Average-Price -------*/
    s[i]['ema'] = function(p) {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var EMA_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " EMA " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#a0a",
        "showInLegend": true,
        "datatype": "TP",
        "data": EMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(EMA_series.id);
      chart.data.Series.push(EMA_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*----------Adding support for Wilder Moving Average--------*/
    s[i]['wma'] = function(p) {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var WMA_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " WMA " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#a0a",
        "showInLegend": true,
        "datatype": "TP",
        "data": WMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(WMA_series.id);
      chart.data.Series.push(WMA_series);
      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-----------Adding support for Moving Average Envelope--------*/
    s[i]['mae'] = function(p, perctg) {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var maeUP_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MAE-UP " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": MAE(p, perctg, this.data)[0],
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(maeUP_series.id);
      chart.data.Series.push(maeUP_series);

      var maeMID_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MAE-MID " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": MAE(p, perctg, this.data)[1],
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(maeMID_series.id);
      chart.data.Series.push(maeMID_series);

      var maeDOWN_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MAE-DOWN " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#aaa",
        "showInLegend": true,
        "datatype": "TP",
        "data": MAE(p, perctg, this.data)[2],
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(maeDOWN_series.id);
      chart.data.Series.push(maeDOWN_series);

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-----------Adding support for Bollinger Bands------------------*/
    s[i]['bobands'] = function(p, m) {

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      };

      var bbUP_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " BB-UP " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": BoBands(p, m, this.data)[0],
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(bbUP_series.id);
      chart.data.Series.push(bbUP_series);

      var bbMID_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " BB-MID " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": BoBands(p, m, this.data)[1],
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(bbMID_series.id);
      chart.data.Series.push(bbMID_series);

      var bbDOWN_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " BB-DOWN " + p,
        "type": "line",
        "lineWidth": 2,
        "color": "#aaa",
        "showInLegend": true,
        "datatype": "TP",
        "data": BoBands(p, m, this.data)[2],
        "xaxis": this.xaxis,
        "yaxis": this.yaxis
      }
      returnVar.series.push(bbDOWN_series.id);
      chart.data.Series.push(bbDOWN_series);

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-------------------Adding support for PPO----------------------*/
    s[i]['ppo'] = function(p1, p2, sp, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var ppo_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "PPO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(ppo_axis.id);
      chart.data.YAxis.push(ppo_axis);

      var ppo_result = PPO(p1, p2, sp, this.data);
      var ppo_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PPO " + p1 + "," + p2,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ppo_result[0],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(ppo_series.id);
      chart.data.Series.push(ppo_series);

      var ppo_signal_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PPO-Signal " + sp,
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ppo_result[1],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(ppo_signal_series.id);
      chart.data.Series.push(ppo_signal_series);

      var ppo_diffbar_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PPO-Diff ",
        "type": "bar",
        "barWidth": 5,
        "color": "#faa",
        "showInLegend": true,
        "datatype": "TV",
        "data": ppo_result[2],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(ppo_diffbar_series.id);
      chart.data.Series.push(ppo_diffbar_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*-------------------------------------------------------------*/

    /*--------------------Adding support for PVO-------------------*/
    s[i]['pvo'] = function(p1, p2, sp, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var pvo_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "PVO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(pvo_axis.id);
      chart.data.YAxis.push(pvo_axis);

      var pvo_result = PVO(p1, p2, sp, this.data);
      var pvo_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PVO " + p1 + "," + p2,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": pvo_result[0],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(pvo_series.id);
      chart.data.Series.push(pvo_series);

      var pvo_signal_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PVO-Signal " + sp,
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": pvo_result[1],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(pvo_signal_series.id);
      chart.data.Series.push(pvo_signal_series);

      var pvo_diffbar_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " PVO-Diff ",
        "type": "bar",
        "barWidth": 5,
        "color": "#faa",
        "showInLegend": true,
        "datatype": "TV",
        "data": pvo_result[2],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(pvo_diffbar_series.id);
      chart.data.Series.push(pvo_diffbar_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*--------------------------------------------------------------*/

    /*--------------------Adding support for MACD-------------------*/
    s[i]['macd'] = function(p1, p2, sp, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var macd_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "MACD",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(macd_axis.id);
      chart.data.YAxis.push(macd_axis);

      var macd_result = MACD(p1, p2, sp, this.data);
      var macd_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MACD " + p1 + "," + p2,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": macd_result[0],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(macd_series.id);
      chart.data.Series.push(macd_series);

      var macd_signal_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MACD-Signal " + sp,
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": macd_result[1],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(macd_signal_series.id);
      chart.data.Series.push(macd_signal_series);

      var macd_diffbar_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MACD-Diff ",
        "type": "bar",
        "barWidth": 5,
        "color": "#faa",
        "showInLegend": true,
        "datatype": "TV",
        "data": macd_result[2],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(macd_diffbar_series.id);
      chart.data.Series.push(macd_diffbar_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*--------------Adding support for ATR-SMA-----------------------*/
    s[i]['atr_sma'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var atr_sma_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "ATR-SMA",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }
      returnVar.yaxis.push(atr_sma_axis.id);
      chart.data.YAxis.push(atr_sma_axis);

      var atr_sma_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " ATR-SMA ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ATR_SMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(atr_sma_series.id);
      chart.data.Series.push(atr_sma_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*------------------Adding support for ATR-EMA ------------------*/
    s[i]['atr_ema'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var atr_ema_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "ATR-EMA",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }
      returnVar.yaxis.push(atr_ema_axis.id);
      chart.data.YAxis.push(atr_ema_axis);

      var atr_ema_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " ATR-EMA ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ATR_EMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(atr_ema_series.id);
      chart.data.Series.push(atr_ema_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*--------------------Adding support for ATR-WMA-----------------*/
    s[i]['atr_wma'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var atr_wma_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "ATR-WMA",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5", //Number of Ticks
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }
      returnVar.yaxis.push(atr_wma_axis.id);
      chart.data.YAxis.push(atr_wma_axis);

      var atr_wma_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " ATR-WMA ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ATR_WMA(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(atr_wma_series.id);
      chart.data.Series.push(atr_wma_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*----------------------Adding support for FSO-------------------*/
    s[i]['fso'] = function(p, sp, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var fso_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "FSO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(fso_axis.id);
      chart.data.YAxis.push(fso_axis);

      var fso_result = FSO(p, sp, this.data);
      var fso_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " FSO-%K " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": fso_result[0],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(fso_series.id);
      chart.data.Series.push(fso_series);

      var fso_signal_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " FSO-%D " + sp,
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": fso_result[1],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(fso_signal_series.id);
      chart.data.Series.push(fso_signal_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*---------------------Adding support for SSO--------------------*/
    s[i]['sso'] = function(p1, p2, sp, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var sso_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "SSO",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(sso_axis.id);
      chart.data.YAxis.push(sso_axis);

      var sso_result = SSO(p1, p2, sp, this.data);
      var sso_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " SSO-%K " + p1 + "-" + p2,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": sso_result[0],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(sso_series.id);
      chart.data.Series.push(sso_series);

      var ssoD_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " SSO-%D " + sp,
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": sso_result[1],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(ssoD_series.id);
      chart.data.Series.push(ssoD_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-------------------Adding support for KDJ----------------------*/
    s[i]['kdj'] = function(p, sp, attr) {
      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var kdj_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "KDJ",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(kdj_axis.id);
      chart.data.YAxis.push(kdj_axis);

      var kdj_result = KDJ(p, sp, this.data);
      var kdjK_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " KDJ-%K " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": kdj_result[0],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(kdjK_series.id);
      chart.data.Series.push(kdjK_series);

      var kdjD_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " KDJ-%D " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": kdj_result[1],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(kdjD_series.id);
      chart.data.Series.push(kdjD_series);

      var kdjJ_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " KDJ-%J " + p,
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": kdj_result[2],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }
      returnVar.series.push(kdjJ_series.id);
      chart.data.Series.push(kdjJ_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*----------------Adding support for WilliamR-------------------*/
    s[i]['wr'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;


      var wr_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "WR",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(wr_axis.id);
      chart.data.YAxis.push(wr_axis);

      var wr_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " WR ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": williamR(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(wr_series.id);
      chart.data.Series.push(wr_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-------Adding support for Commodity Channel Index (CCI) -------*/
    s[i]['cci'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var cci_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "CCI",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(cci_axis.id);
      chart.data.YAxis.push(cci_axis);

      var cci_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " CCI ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": CCI(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(cci_series.id);
      chart.data.Series.push(cci_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-------Adding support for Rate Of Change (ROC)-----------------*/

    s[i]['roc'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var roc_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "ROC",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(roc_axis.id);
      chart.data.YAxis.push(roc_axis);

      var roc_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " ROC ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ROC(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(roc_series.id);
      chart.data.Series.push(roc_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-------Adding support for Rate Of Change (ROC)-Volume ---------*/

    s[i]['rocv'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var rocv_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "ROC-V",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(rocv_axis.id);
      chart.data.YAxis.push(rocv_axis);

      var rocv_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " ROC-V ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": ROCV(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(rocv_series.id);
      chart.data.Series.push(rocv_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*--------------------------------------------------------*/

    /*-----------------Adding support for TRIX----------------*/
    s[i]['trix'] = function(p, sp, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var trix_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "TRIX",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(trix_axis.id);
      chart.data.YAxis.push(trix_axis);

      var trix_result = TRIX(p, sp, this.data);
      var trixK_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " TRIX-%K " + p + "-" + sp,
        "type": "line",
        "lineWidth": 1,
        "color": "#0a0",
        "showInLegend": true,
        "datatype": "TP",
        "data": trix_result[0],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(trixK_series.id);
      chart.data.Series.push(trixK_series);

      var trixD_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " TRIX-%D " + sp,
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": trix_result[1],
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(trixD_series.id);
      chart.data.Series.push(trixD_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-------Adding support for Relative Strength Index (RSI) -------*/

    s[i]['rsi'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;


      var rsi_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "RSI",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(rsi_axis.id);
      chart.data.YAxis.push(rsi_axis);

      var rsi_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " RSI ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": RSI(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(rsi_series.id);
      chart.data.Series.push(rsi_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

    /*-------Adding support for Money Flow Index (MFI) --------------*/

    s[i]['mfi'] = function(p, attr) {

      if (typeof(attr) == "undefined") attr = {}
      if (typeof(attr.height) == "undefined") attr.height = defaultIndicatorAxisHeight;
      if (typeof(attr.paddingTop) == "undefined") attr.paddingTop = defaultIndicatorAxisPaddingTop;

      var returnVar = {
        series: [],
        yaxis: [],
        xaxis: []
      },
        yMax = 0,
        yIndex;

      for (var i = 0; i < chart.data.YAxis.length; i++) {
        if (chart.data.YAxis[i].y * 1 > yMax * 1) {
          yMax = chart.data.YAxis[i].y * 1;
          yIndex = i;
        }
      }
      var yPos = yMax * 1 + (chart.data.YAxis[yIndex].height * 1) + attr.paddingTop;

      var mfi_axis = {
        "id": chart.data.YAxis.length + 1,
        "type": "number",
        "x": chart.yAxisById(this.yaxis).x,
        "y": yPos,
        "height": attr.height,
        "axisColor": "#aaa",
        "thickness": "1",
        "axisOpacity": "0.6",
        "label": "MFI",
        "labelStyle": {
          fill: "#444",
          "font-size": '15',
          "font-weight": "bold"
        },
        "TickColor": "#aaa",
        "TickLength": "5",
        "TickThick": "1",
        "TickNum": "5",
        "TickOffset": "10",
        "TickTextStyle": {
          'fill': '#000',
          'font-size': '12',
          'font-weight': 'normal'
        },
        "TicTexRot": "r0",
        "LabelOffset": "50",
        "LabelRot": "r-90"
      }

      returnVar.yaxis.push(mfi_axis.id);
      chart.data.YAxis.push(mfi_axis);

      var mfi_series = {
        "id": chart.data.Series.length + 1,
        "name": this.name + " MFI ",
        "type": "line",
        "lineWidth": 1,
        "color": "#aa0",
        "showInLegend": true,
        "datatype": "TP",
        "data": MFI(p, this.data),
        "xaxis": this.xaxis,
        "yaxis": chart.data.YAxis.length
      }

      returnVar.series.push(mfi_series.id);
      chart.data.Series.push(mfi_series);

      var xaxisIndex = chart.getAxisById("x", this.xaxis);
      chart.data.XAxis[xaxisIndex].y = yPos + attr.height;

      return returnVar;
    }
    /*---------------------------------------------------------------*/

  }

}
