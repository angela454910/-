const category = [
  {
    id: "1bcddudhmh",
    type: 0,
    name: "车贷",
  },
  {
    id: "hc5g66kviq",
    type: 0,
    name: "	车辆保养",
  },
  {
    id: "8s0p77c323",
    type: 0,
    name: "房贷",
  },
  {
    id: "0fnhbcle6hg",
    type: 0,
    name: "房屋租赁",
  },
  {
    id: "odrjk823mj8",
    type: 0,
    name: "家庭用品",
  },
  {
    id: "bsn20th0k2o",
    type: 0,
    name: "交通",
  },
  {
    id: "j1h1nohhmmo",
    type: 0,
    name: "旅游",
  },
  {
    id: "3tqndrjqgrg",
    type: 0,
    name: "日常饮食",
  },
  {
    id: "s73ijpispio",
    type: 1,
    name: "工资",
  },
  {
    id: "1vjj47vpd28",
    type: 1,
    name: "股票投资",
  },
  {
    id: "5il79e11628",
    type: 1,
    name: "基金投资",
  },
];

const monthMap = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

// Elements
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");

const containerApp = document.querySelector("#app");
const containerMovements = document.querySelector(".movements");

const btnAddMov = document.querySelector(".form__btn--addMov");
const btnAddCategory = document.querySelector(".form__btn--addCategory");
const monthSelector = document.querySelector("#month-selector");
const typeSelector = document.querySelector(".input--type");

const movInputCategory = document.querySelector(".input--category");
const movInputAmount = document.querySelector(".mov__input--amount");
const cateInputId = document.querySelector(".category__input--id");
const cateInputName = document.querySelector(".category__input--name");

const msgEl = document.querySelector(".msg");

// helper
const transferCategory = function (id) {
  const selected = category.find((element) => element.id === id);
  // console.log(selected);
  return selected ? selected.name : "无";
};

const formatDate = function (dateTime) {
  const date = new Date(dateTime);
  const year = date.getFullYear() + "年";
  const month = date.getMonth() + 1 + "月";
  const day = date.getDate() + "日";
  return [year, month, day].join("");
};

const formatFile = function (text) {
  const res = [];
  const data = text.split("\n");
  for (let i = 1; i < data.length; i++) {
    const el = data[i].split(",");
    const mov = {
      type: parseInt(el[0]),
      time: parseInt(el[1]),
      category: el[2],
      amount: parseInt(el[3]),
    };
    res.push(mov);
  }
  return res;
};

const topFunction = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

const displayMsg = (msg, type) => {
  if (type === "error") {
    if (msgEl.classList.contains("msg--success")) {
      msgEl.classList.remove("msg--success");
    }
    msgEl.classList.add("msg--alert");
  } else if (type === "success") {
    if (msgEl.classList.contains("msg--alert")) {
      msgEl.classList.remove("msg--alert");
    }
    msgEl.classList.add("msg--success");
  }
  msgEl.textContent = msg;
};

// movements
const createMovementRow = function (mov) {
  const html = `<div class="movements__row">
  <div class="movements__type movements__type--${mov.type}">${mov.type}</div>
  <div class="movements__time">${formatDate(mov.time)}</div>
  <div class="movements__category">${transferCategory(mov.category)}</div>
  <div class="movements__amount">${mov.amount}</div>
</div>`;

  containerMovements.insertAdjacentHTML("afterbegin", html);
};

const displayMovements = function (data) {
  containerMovements.innerHTML = "";
  document.querySelector(".total").textContent = `total ${data.length} records`;
  data.forEach((el) => createMovementRow(el));
};

// summary
const displaySummary = function (data) {
  const incomes = data
    .filter((mov) => mov.amount > 0)
    .reduce((sum, cur) => sum + cur.amount, 0);
  labelSumIn.textContent = `${incomes} ￥`;

  const outputs = data
    .filter((mov) => mov.amount < 0)
    .reduce((sum, cur) => sum + cur.amount, 0);
  labelSumOut.textContent = `${Math.abs(outputs)} ￥`;
};

// Operation
const createCategoryList = (cate) => {
  const html = `<option value="${cate.id}">${cate.name}</option>`;
  movInputCategory.insertAdjacentHTML("afterbegin", html);
};

const displayCategory = (data) => {
  category.forEach((el) => {
    createCategoryList(el);
  });
};
displayCategory(category);

btnAddCategory.addEventListener("click", function (e) {
  e.preventDefault();
  const id = cateInputId.value.trim();
  const index = typeSelector.selectedIndex;
  const type = parseInt(typeSelector.options[index].value);
  const name = cateInputName.value.trim();
  if (!id || !type.toString() || !name) {
    displayMsg("请填写id, type, name", "error");
    topFunction();
    return;
  }
  //   console.log(category.find((el) => el.id === id));
  if (category.find((el) => el.id === id) === undefined) {
    category.push({ id, type, name });
    displayMsg(`新的标签已创建 -- ${name}`, "success");
    cateInputId.value = "";
    cateInputName.value = "";
    typeSelector.value = "0";
    topFunction();
    displayCategory(category);
  } else {
    displayMsg("该标签已存在", "error");
    topFunction();
  }
});

fetch("./bill.csv")
  .then((f) => f.text())
  .then((res) => {
    const movements = formatFile(res);
    console.log(movements);
    displayMovements(movements);
    displaySummary(movements);

    monthSelector.addEventListener("change", function () {
      const index = monthSelector.selectedIndex;
      const month = monthMap[monthSelector.options[index].value];
      // console.log(month);
      if (month) {
        const selectedData = movements.filter(
          (element) => new Date(element.time).getMonth() + 1 === month
        );
        displayMovements(selectedData);
        displaySummary(selectedData);
        msgEl.style.opacity = 0;
      } else {
        displayMovements(movements);
        displaySummary(movements);
      }
    });

    // operation
    btnAddMov.addEventListener("click", function (e) {
      e.preventDefault();
      const typeIndex = typeSelector.selectedIndex;
      const type = parseInt(typeSelector.options[typeIndex].value);
      const cateIndex = movInputCategory.selectedIndex;
      const category = movInputCategory.options[cateIndex].value;
      const amount = parseInt(movInputAmount.value);
      if (!type.toString() || !amount) {
        displayMsg("请添加type, amount", "error");
      } else {
        movements.push({
          type,
          time: new Date().getTime(),
          category,
          amount: type === 1 ? amount : -amount,
        });
        displayMovements(movements);
        displaySummary(movements);
        displayMsg("添加成功", "success");
        typeSelector.value = "0";
        movInputCategory.value = "";
        movInputAmount.value = "";
        console.log(movements);
      }
    });
  })
  .catch((err) => {
    displayMsg("读取文件失败", "error");
  });
