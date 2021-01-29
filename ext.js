let rows = null;
let showAll = true;
let selectedTeams = new Set();

function getAppSpinner() {
  return document.querySelector('app-spinner');
}

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

const TOGGLE_GROUP_CLASS = 'show-selected-toggle';
function createToggleGroup() {
  const existing = document.querySelector(`.${TOGGLE_GROUP_CLASS}`);
  if (existing) {
    existing.remove();
  }

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
  wrapper.classList.add('toggles-in-page-wrapper', 'm-0', TOGGLE_GROUP_CLASS);
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
    const teamNameDiv = teamCol.querySelector('.hidden-lg-down');
    const teamName = teamNameDiv ? teamNameDiv.innerText : '';

    // Only add checkbox if not yet present
    if (teamCol.querySelector('.select-row')) {
      return;
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('select-row');
    if (selectedTeams.has(teamName)) {
      checkbox.checked = true;
      row.classList.add('selected');
    }

    checkbox.addEventListener('change', () => {
      const selected = row.classList.toggle('selected');
      if (selected) {
        selectedTeams.add(teamName);
      } else {
        selectedTeams.delete(teamName);
      }
    });
    teamCol.prepend(checkbox);
  });
}

function initExt() {
  setupControlsBar();
  addSelectCheckboxes();
}

function loadSelectControls() {
  // Wait for rows to load
  let loadInterval = setInterval(() => {
    rows = getRows();
    if (rows && rows.length > 0) {
      clearInterval(loadInterval);
      loadInterval = null;
      initExt();
    }
  }, 200);
}

let observer = new MutationObserver(mutations => {
  if (!mutations || mutations.length === 0) return;
  const mutation = mutations[0];
  if (mutation.removedNodes) {
    // Loading finished
    loadSelectControls();
  }
});

function waitForLoad() {
  let spinnerInterval = setInterval(() => {
    let appSpinner = getAppSpinner();
    if (appSpinner) {
      clearInterval(spinnerInterval);
      spinnerInterval = null;
      loadSelectControls();
      observer.observe(appSpinner, {
        childList: true,
      });
    }
  }, 200);
}

waitForLoad();
