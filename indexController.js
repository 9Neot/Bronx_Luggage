const paths = ["luggage", "backpacks", "bags", "briefcases", "accessories"];

const app = angular.module("myApp", ["ngRoute"]);

app.config(($routeProvider) => {
  $routeProvider
    .when("/", { templateUrl: "./pages/home.html" })
    .when("/luggage", {
      templateUrl: "./pages/luggage.html",
      controller: "myCtrl",
    })
    .when("/bags", { templateUrl: "./pages/bags.html", controller: "myCtrl" })
    .when("/briefcases", {
      templateUrl: "./pages/briefcases.html",
      controller: "myCtrl",
    })
    .when("/backpacks", {
      templateUrl: "./pages/backpacks.html",
      controller: "myCtrl",
    })
    .when("/accessories", {
      templateUrl: "./pages/accessories.html",
      controller: "myCtrl",
    })
    .when("/men", {
      templateUrl: "./pages/men.html",
      controller: "myCtrl",
    })
    .when("/women", {
      templateUrl: "./pages/women.html",
      controller: "myCtrl",
    })
    .when("/kids", {
      templateUrl: "./pages/kids.html",
      controller: "myCtrl",
    })
    .when("/about_us", {
      templateUrl: "./pages/about_us.html",
      controller: "myCtrl",
    })
    .when("/contact_us", {
      templateUrl: "./pages/contact_us.html",
      controller: "myCtrl",
    });
});

app.controller(
  "myCtrl",
  function ($scope, $http, $location, $window, $interval) {
    geoFindMe();

    $interval(() => {
      const newdateTime = new Date();
      $scope.dateTime = newdateTime.toLocaleString();
    }, 1000);

    $scope.enterSite = function (href) {
      $window.location.href = href;
    };

    const wrapper = document.querySelector(".wrapper");
    wrapper.onscroll = function () {
      scrollFunction();
    };

    $scope.backToTop = backToTop;
    $scope.width = document.body.offsetWidth;
    $scope.searchPlaceholder = "Enter product name";
    $scope.namePlaceholder = "Enter your name (mandatory)";
    if ($scope.width > 1200) {
      $scope.pageSize = 20;
    } else if ($scope.width > 768) {
      $scope.pageSize = 16;
    } else if ($scope.width > 600) {
      $scope.pageSize = 12;
    } else {
      $scope.pageSize = 10;
      $scope.searchPlaceholder = "Search name";
      $scope.namePlaceholder = "Enter your name";
    }
    $scope.changePage = changePage;
    $scope.currentPage = 0;
    $scope.count = 1;
    countVisiter();
    $scope.title = "Default";
    $scope.model = {};
    $scope.search = "";
    $scope.bestSeller = [];
    $scope.sale = [];
    $scope.brands = {};
    $scope.colors = {};
    $scope.filter = {
      luggage: {
        brand: [],
        kid: false,
        gender: [],
        color: [],
        size: [],
        price: [],
      },
      backpacks: {
        brand: [],
        kid: false,
        gender: [],
        color: [],
        size: [],
        price: [],
      },
      bags: {
        brand: [],
        kid: false,
        gender: [],
        color: [],
        size: [],
        price: [],
      },
      accessories: {
        brand: [],
        kid: false,
        gender: [],
        color: [],
        size: [],
        price: [],
      },
      briefcases: {
        brand: [],
        kid: false,
        gender: [],
        color: [],
        size: [],
        price: [],
      },
    };
    $scope.calcNumberOfPages = calcNumberOfPages;
    $scope.changeState = changeState;
    $scope.sort = sort;
    $scope.popup = popup;
    $scope.changeImg = changeImg;
    $scope.reChangeImg = reChangeImg;
    $scope.sendFeedback = sendFeedback;
    $scope.rate = rate;
    $scope.closePopup = closePopup;
    $scope.changeGenderState = changeGenderState;
    $scope.fun = fun;
    $scope.clickElement = clickElement;
    $scope.display = display;
    $scope.disappear = disappear;
    $scope.slide = slide;
    $scope.disappearAside = disappearAside;
    $scope.displayAside = displayAside;
    $scope.setInputSize = setInputSize;

    getData(paths);

    function getData(arr) {
      arr.forEach((item) => {
        $http.get(`./json/${item}.json`).then((res) => {
          $scope[item] = res.data;

          const brand = [];
          const color = [];

          $scope[item].forEach((i) => {
            brand.push(i.brand);
          });

          $scope.brands[item] = [
            ...new Map(brand.map((item) => [item["name"], item])).values(),
          ];

          $scope[item].forEach((i) => {
            if (!color.includes(i.color)) color.push(i.color);
          });
          $scope.colors[item] = [...color];

          const bestseller = $scope[item].filter((i) => i.bestSeller);
          $scope.bestSeller.push(...bestseller);

          const sale = $scope[item].filter((i) => i.price.discounted);
          $scope.sale.push(...sale);
        });
      });
    }

    function changeState(prop, value, name) {
      if (!$scope.filter[name][prop].includes(value)) {
        $scope.filter[name][prop].push(value);
      } else {
        const index = $scope.filter[name][prop].indexOf(value);
        $scope.filter[name][prop].splice(index, 1);
      }
      changePage(0);
    }

    function sort(prop, reverse, title) {
      $scope.prop = prop;
      $scope.reverse = reverse;
      $scope.title = title;
    }

    function popup(name, id) {
      $scope.star = 0;
      const product = $scope[name].find((i) => i.id === id);
      $scope.model = product;
    }

    function countVisiter() {
      if (localStorage.getItem("visiter")) {
        $scope.count = parseInt(localStorage.getItem("visiter"));
        if ($location.path() === "/") {
          $scope.count++;
        }
      }
      localStorage.setItem("visiter", $scope.count.toString());
    }

    function changeImg(src) {
      const img = document.querySelector("#popup_thumbnail");
      img.setAttribute("src", src);
    }

    function reChangeImg(src) {
      const img = document.querySelector("#popup_thumbnail");
      img.setAttribute("src", src);
    }

    function getAllElement(e) {
      let result = [],
        node = e.target.parentNode.firstChild;

      while (node) {
        if (node !== this && node.nodeType === Node.ELEMENT_NODE) {
          result.push(node);
        }
        node = node.nextElementSibling || node.nextSibling;
      }
      return result;
    }

    function closePopup() {
      setFeedbackDefault();
    }

    function rate(star, e) {
      $scope.star = star;
      $scope.node = e;

      getAllElement(e)
        .reverse()
        .forEach((item, index) => {
          if (index < star) {
            item.style.color = "gold";
          } else {
            item.style.color = "#000";
          }
        });
    }

    function setFeedbackDefault() {
      const feedback = document.querySelector("#feedback");
      const nameInput = document.querySelector("#nameInput");
      if ($scope.node) {
        getAllElement($scope.node).forEach((i) => {
          i.style.color = "#000";
        });
      }
      feedback.value = "";
      nameInput.value = "";
      $scope.star = 0;
    }

    $scope.inputChange = inputChange;
    function inputChange() {
      const nameInput = document.querySelector("#nameInput");
      const error = document.querySelector(".error");
      if (nameInput.validity.valid) {
        error.textContent = "";
        error.className = "error";
      } else {
        showError();
      }
    }

    function sendFeedback() {
      const nameInput = document.querySelector("#nameInput");
      if (!nameInput.validity.valid) {
        showError();
      } else {
        const feedback = document.querySelector("#feedback");
        const nameInput = document.querySelector("#nameInput");

        $scope.model.feedback.push({
          name: nameInput.value,
          text: feedback.value,
          rating: $scope.star,
        });
        const lastTotalReviews = $scope.model.reviews.total_reviews;
        $scope.model.reviews.total_reviews++;
        const lastRating = $scope.model.reviews.rating;
        $scope.model.reviews.rating =
          (lastRating * lastTotalReviews + $scope.star) /
          $scope.model.reviews.total_reviews;
        setFeedbackDefault();
      }
    }

    function showError() {
      const nameInput = document.querySelector("#nameInput");
      const error = document.querySelector(".error");
      if (nameInput.validity.valueMissing) {
        error.textContent = "You need to enter a name.";
      }

      error.className = "error active";
    }

    function changeGenderState(name) {
      $scope.filter[name].gender = [];
    }

    function fun(gender1, gender2, gender3) {
      let gender1E = document.querySelector(`#${gender1}`);
      let gender2E = document.querySelector(`#${gender2}`);
      let gender3E = document.querySelector(`#${gender3}`);
      let checkBoxArr = document.querySelectorAll("input[type='checkbox']");
      if (checkBoxArr.length) {
        checkBoxArr.forEach((i) => {
          if (i.checked) {
            i.click();
          }
        });
      }
      if (gender1E) {
        if (!gender1E.checked) {
          gender1E.click();
        }
      }
      if (gender2E) {
        if (gender2E.checked) {
          gender2E.click();
        }
      }
      if (gender3E) {
        if (gender3E.checked) {
          gender3E.click();
        }
      }
      $scope.$on("$routeChangeSuccess", function () {
        gender1E = document.querySelector(`#${gender1}`);
        gender2E = document.querySelector(`#${gender2}`);
        gender3E = document.querySelector(`#${gender3}`);
        if (gender1E) {
          if (!gender1E.checked) {
            gender1E.click();
          }
        }
        if (gender2E) {
          if (gender2E.checked) {
            gender2E.click();
          }
        }
        if (gender3E) {
          if (gender3E.checked) {
            gender3E.click();
          }
        }
      });
      const pages = document.querySelectorAll(".page-link");
      if (pages.length > 0) {
        pages[1].click();
      }
    }

    function clickElement(id) {
      const element = document.querySelector(`#${id}`);
      element.click();
    }

    function display() {
      const navLink = document.querySelector(".link");
      navLink.classList.add("nav_active");
    }

    function disappear() {
      const navLink = document.querySelector(".link");
      navLink.classList.remove("nav_active");
    }

    function disappearAside() {
      const aside = document.querySelector("aside");
      const content = document.querySelector(".content");
      const pagination = document.querySelector(".pagination");
      const container = document.querySelector("#container");

      content.classList.remove("hidden");
      if (pagination) {
        pagination.classList.remove("hidden");
      }
      aside.classList.remove("aside_active");
      container.style.height = "";
    }

    function displayAside() {
      const aside = document.querySelector("aside");
      const content = document.querySelector(".content");
      const pagination = document.querySelector(".pagination");
      const container = document.querySelector("#container");

      content.classList.add("hidden");
      if (pagination) {
        pagination.classList.add("hidden");
      }
      aside.classList.add("aside_active");
      container.style.height = `${aside.offsetHeight}px`;
    }

    function calcNumberOfPages() {
      return Math.ceil($scope.result.length / $scope.pageSize);
    }

    function changePage(i) {
      const pages = document.querySelectorAll(".page-link");
      pages.forEach((item) => item.classList.remove("active"));
      if (pages[i + 1]) {
        pages[i + 1].classList.add("active");
      }
      $scope.currentPage = i;
      backToTop();
    }

    function scrollFunction() {
      const mybutton = document.getElementById("btn-back-to-top");
      if (wrapper.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }

    function backToTop() {
      wrapper.scrollTo({ top: 0, behavior: "smooth" });
    }

    function setInputSize(id) {
      const input = document.querySelector(id);
      input.setAttribute("size", input.getAttribute("placeholder").length);
    }

    function slide(id) {
      if (!id) {
        id = "";
      }
      const ticker = document.querySelector(`.ticker${id}`);
      const list = document.querySelector(`.ticker_list${id}`);
      const clone = list.cloneNode(true);

      ticker.append(clone);
    }

    function geoFindMe() {
      const mapLink = document.querySelector("#map-link");

      mapLink.href = "";
      $scope.mapLink = "";

      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        mapLink.href = `https://www.google.com/maps/place/${latitude},${longitude}/@${latitude},${longitude}z/data=!3m1!4b1!4m4!3m3!8m2!3d41.403389!4d2.174028;`;
        $scope.mapLink = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
      }

      function error() {
        $scope.mapLink = "Unable to retrieve your location";
      }

      if (!navigator.geolocation) {
        $scope.mapLink = "Geolocation is not supported by your browser";
      } else {
        navigator.geolocation.getCurrentPosition(success, error);
      }
    }
  }
);

app.filter("myFormat", function () {
  return function (item) {
    if (item) {
      return item.filter((i) => i.logo);
    }
  };
});

app.filter("myFilter", function () {
  return function (item, scope) {
    const name = paths.find((i) => scope[i] === item);

    let newArr = [...item];
    Object.keys(scope.filter[name]).forEach((prop) => {
      if (prop === "brand") {
        newArr = [
          ...newArr.filter(
            (product) =>
              scope.filter[name][prop].includes(product[prop].name) ||
              scope.filter[name][prop].length === 0
          ),
        ];
      } else if (prop === "kid") {
        newArr = [
          ...newArr.filter(
            (product) => scope.filter[name][prop] === product[prop]
          ),
        ];
      } else if (prop === "price") {
        newArr = [
          ...newArr.filter((product) => {
            if (
              name === "accessories" ||
              name === "backpacks" ||
              name === "bags"
            ) {
              return (
                scope.filter[name][prop].includes(
                  Math.floor(product[prop].current_price / 10) * 10
                ) || scope.filter[name][prop].length === 0
              );
            }
            return (
              scope.filter[name][prop].includes(
                Math.floor(product[prop].current_price / 100) * 100
              ) || scope.filter[name][prop].length === 0
            );
          }),
        ];
      } else {
        newArr = [
          ...newArr.filter(
            (product) =>
              scope.filter[name][prop].includes(product[prop]) ||
              product[prop] === undefined ||
              scope.filter[name][prop].length === 0
          ),
        ];
      }
    });

    return newArr.filter((i) => {
      const regex = new RegExp(scope.search.toLowerCase());
      return regex.test(i.name.toLowerCase());
    });
  };
});

app.filter("startFrom", function () {
  return function (input, start) {
    start = +start;
    return input.slice(start);
  };
});
