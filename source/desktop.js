(function($, PLUGIN_ID) {
  const config = {
    tables: [
      { tableCode: "表格", columnNum: 3, rowNum: 4 },
      { tableCode: "表格_0", columnNum: 3, rowNum: 3 }
    ]
  };
  const maxWidth = $(window).width() - 80;
  let targetSubtables;

  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.detail.show"
    ],
    event => {
      $(".gaia-argoui-floater").css("z-index", 3);
      $("#appForm-gaia")
        .parent()
        .css("z-index", 3);
      $("#appForm-gaia").css("z-index", 3);
      $(".gaia-argoui-app-show-sidebar").css("z-index", 3);
      init();
      setTimeout(() => {
        targetSubtables.forEach(subTable => {
          initCustomTableView(subTable);
        });
      }, 2000);
    }
  );
  function initCustomTableView(configTable) {
    const $tableField = $(`.subtable-${configTable.subTableID}`);
    console.log($tableField.outerWidth());
    $tableField.wrap(
      `<div id="fa" style="height:${$tableField.outerHeight()}px;width:${$tableField.outerWidth()}px;"></div>`
    );
    const newParent = $tableField.parent();
    newParent.wrap(
      `<div id="gra" style="width:${maxWidth}px;overflow:auto"></div>`
    );

    updateTableView($tableField, configTable);
  }
  function init() {
    targetSubtables = getSubtables(config.tables);
    targetSubtables.forEach(targetSubtable => {
      console.log(targetSubtable.subTableCode);
      console.log(`app.record.edit.change.${targetSubtable.subTableCode}`);
      const $tableField = $(`.subtable-${targetSubtable.subTableID}`);
      kintone.events.on(
        [
          `app.record.edit.change.${targetSubtable.subTableCode}`,
          `app.record.create.change.${targetSubtables.subTableCode}`
        ],
        event => {
          console.log(event);
          updateTableView($tableField, targetSubtable);
          return event;
        }
      );
    });
  }
  function updateTableView($tableField, configTable) {
    $tableField.parent().css({
      width: $tableField.outerWidth(),
      height: $tableField.outerHeight()
    });
    updateThStyles($tableField, configTable);

    const maxHeight = updateTdStyles($tableField, configTable); // todo

    const $gra = $tableField.parent().parent();
    if ($gra.outerWidth !== maxHeight) {
      $gra.css({ height: `${maxHeight}px` });
    }
  }

  function updateThStyles($tableField, configTable) {
    let thWidth = 0;
    const elementThs = $tableField
      .find("th")
      .css({ position: "sticky", top: 0, "z-index": 1 });
    if (configTable.lockColumnNum > elementThs.length) {
      configTable.lockColumnNum = elementThs.length;
    }
    for (let index = 0; index < configTable.lockColumnNum; index++) {
      const $elementTh = elementThs
        .eq(index)
        .css({ "z-index": 2, position: "sticky", left: thWidth });
      thWidth += $elementTh.outerWidth();
    }
  }
  function updateTdStyles($tableField, configTable) {
    let maxHeight = $tableField.find("thead").outerHeight();
    $tableField.find("tr").each((rowIndex, elementTr) => {
      const $tr = $(elementTr);
      if (rowIndex < configTable.lockRowNum) {
        maxHeight += $tr.outerHeight();
      }
      let tdWidth = 0;
      $tr.find("td").each((columnIndex, elementTd) => {
        const $td = $(elementTd);
        if (columnIndex < configTable.lockColumnNum) {
          $td.css({
            position: "sticky",
            left: tdWidth,
            "z-index": 1,
            "background-color": "#f5f5f5"
          });
          tdWidth += $td.outerWidth();
        }
      });
    });
    return maxHeight;
  }
  function getSubtables(configTables) {
    const subtables = cybozu.data.page.FORM_DATA.schema.subTable;
    const resultTables = [];
    Object.values(subtables).forEach(item => {
      configTables.forEach(subtable => {
        console.log(subtable);
        if (item.var === subtable.tableCode) {
          resultTables.push({
            subTableID: item.id,
            subTableCode: subtable.tableCode,
            lockColumnNum: subtable.columnNum,
            lockRowNum: subtable.rowNum
          });
        }
      });
    });
    console.log(resultTables);
    return resultTables;
  }
})(jQuery, kintone.$PLUGIN_ID);
