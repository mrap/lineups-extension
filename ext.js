/*
 * 1. For each row, put a button that will mark the row as 'selected'
 */

let rows = null;
let showAll = true;

function getTable() {
  return document.querySelector('.multi-row-data-table');
}

function getRows() {
  return document.querySelectorAll('.multi-row-data-table tr.t-content');
}

function getControlsBar() {
  return document.querySelector('.row .col-12 .d-flex');
}

function createToggleBtn(label) {
  const toggleBtn = document.createElement('button');
  toggleBtn.classList.add('toggle-in-page', 'toggle-in-page-sm');
  toggleBtn.innerText = label;
  return toggleBtn;
}

function createToggleGroup() {
  const group = document.createElement('div');
  group.classList.add('toggles-in-page-group', 'btn-group', 'toggles-group');
  const allBtn = createToggleBtn('All');
  allBtn.classList.add('first');
  const selectedBtn = createToggleBtn('Selected');
  selectedBtn.classList.add('last');

  function toggleShowAll(shouldShowAll = true) {
    const table = getTable();
    showAll = !shouldShowAll;
    if (shouldShowAll) {
      allBtn.classList.add('active');
      selectedBtn.classList.remove('active');
      table.classList.remove('selected-only');
    } else {
      selectedBtn.classList.add('active');
      allBtn.classList.remove('active');
      table.classList.add('selected-only');
    }
  }

  allBtn.addEventListener('click', () => {
    toggleShowAll(true);
  });
  selectedBtn.addEventListener('click', () => {
    toggleShowAll(false);
  });

  // Set initial active button
  toggleShowAll(showAll);
  group.append(allBtn, selectedBtn);

  const wrapper = document.createElement('div');
  wrapper.classList.add('toggles-in-page-wrapper', 'm-0');
  wrapper.append(group);

  return wrapper;
}

function setupControlsBar() {
  const controlsBar = getControlsBar();
  const toggleGroup = createToggleGroup();
  controlsBar.append(toggleGroup);
}

function addSelectCheckboxes() {
  rows.forEach(row => {
    const teamCol = row.querySelector('.team-col');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('select-row');
    checkbox.addEventListener('change', () => {
      row.classList.toggle('selected');
    });
    teamCol.prepend(checkbox);
  });
}

function initExt() {
  setupControlsBar();
  addSelectCheckboxes();
}

// Wait for rows to load
let loadInterval = setInterval(() => {
  rows = getRows();
  if (rows && rows.length > 0) {
    clearInterval(loadInterval);
    loadInterval = null;
    initExt();
  }
}, 200);
