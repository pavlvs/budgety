var budgetController = (function() {
  // body...
})();

// UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: '.add-type',
    inputDescription: '.add-description',
    inputValue: '.add-value',
    addButton: '.add-btn'
  }
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    getDOMstrings: function () {
      return DOMstrings;
    }
  }
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function () {
    // 1. Get the field input data
    var input = UICtrl.getInput();
    console.log(input);

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI

  };

  return {
    init: function () {
      console.log('app has been initialized');
      setupEventListeners();
    }
  };
  

})(budgetController, UIController);

controller.init();
