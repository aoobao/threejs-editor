

var ObjectInfo = function (editor) {

  var signals = editor.signals;
  var strings = editor.strings;

  var container = new UI.Panel()

  container.setId('object-info')
  container.setDisplay('none')


  // 设备名称
  var objectNameRow = new UI.Row();
  var objectName = new UI.Text().setWidth('150px').setFontSize('16px').setColor('#fff')

  // objectNameRow.add(new UI.Text(strings.getKey('sidebar/object/name'))).setWidth('90px')

  objectNameRow.add(objectName)

  container.add( objectNameRow );


  signals.objectSelected.add(function (object) {

    container.setDisplay(object === null ? 'none' : '');

    // 更新UI
    if (object) {
      updateUI(object)
    }

  });

  function updateUI (object) {
    objectName.setValue(object.name)
  }


  return container
}