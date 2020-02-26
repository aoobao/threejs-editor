


Sidebar.Select = function (editor) {

  var signals = editor.signals
  var strings = editor.strings
  var building = null
  var default_floor = 'node_-2f_-4638'
  // 加载建筑模型
  var loader = new THREE.GLTFLoader()
  loader.setPath('./object/yuanhua/')

  loader.load('yuanhuabuilding.gltf', initBuilding)
  // loader.setPath('./object/bridge/')
  // loader.load('bridge.gltf', initBuilding)

  function initBuilding (obj) {
    building = obj.scene
    addFloor()
  }

  var container = new UI.Panel()

  var rows = []

  container.setBorderTop('0');
  container.setPaddingTop('20px');
  container.setPaddingBottom('20px');

  var options = getFloors()

  var floorRow = new UI.Row()
  var floor = new UI.Select().setWidth('150px')
  floor.setOptions(options)
  floor.setValue(default_floor)

  floorRow.add(new UI.Text(strings.getKey('sidebar/select/floor')).setWidth('90px'))
  floorRow.add(floor)
  container.add(floorRow)

  var titleRow = new UI.Row()
  // var title = new UI.Span().setWidth('90px')

  // title.setTextContent(strings.getKey('sidebar/select/addTitle'))
  titleRow.add(new UI.Text(strings.getKey('sidebar/select/addTitle')).setWidth('90px'))

  var save = new UI.Button(strings.getKey('sidebar/select/save')).setWidth('80px')
  save.onClick(function () {
    alert('TODO')
  })

  titleRow.add(save)

  container.add(titleRow)

  addRows(default_floor)

  floor.onChange(function () {
    var value = this.getValue()

    if (default_floor === value) return

    if (confirm(strings.getKey('message/unsave'))) {
      console.log('change floor event', value)

      default_floor = value

      addFloor()

      // 删除所有按钮
      container.removeTo(function (dom) {
        return dom.classList.contains('device_button')
      })

      rows = []
      addRows(value)


    } else {

      this.setValue(default_floor)
    }
  })

  // 监听设备删除
  signals.objectRemoved.add(function (obj) {
    // console.log(obj)
    // if (STATUS === 'clear') return
    if (obj.userData.isDevice) {
      var name = obj.name // 设备名称

      addDevice(name)
    }
  })

  // 将默认楼层加载在场景中.
  function addFloor () {
    if (building === null) return
    console.log(building)
    var name = default_floor
    var floor = getFloorMesh(name)

    // var floor = building
    if (floor === null) {
      return
    }


    // var bbox = new THREE.Box3().setFromObject(floor)
    // var helper = new THREE.Box3Helper(bbox, 0xffff00)
    // var box = new THREE.BoxHelper( object, 0xffff00 )
    // box.name = 'mesh box'
    // editor.addObject(helper)

    floor.userData.disable = true
    floor.position.set(0, 0, 0)
    // floor.position.set(606.82, 3345.437, 0.026)
    // floor.scale.set(0.01, 0.01, 0.01)

    editor.clear()

    editor.addBuilding(floor)
  }


  function getFloorMesh (id) {
    if (building === null) return null
    var mesh = null
    building.traverse(function (child) {
      var name = child.userData.name
      if (name === id) {
        mesh = child
      }
    })
    if (mesh) {
      var rst = mesh.clone()
      return rst
    } else {
      return null
    }
  }

  function addDevice (deviceName) {
    var row = new UI.Row()
    row.addClass('device_button')
    var button = new UI.Button(deviceName).setWidth('240px')

    button.onClick(function () {
      clickHandle({ name: deviceName, row: row })
    })

    row.add(button)
    rows.push(row)

    container.add(row)
  }

  function addRows (floorId) {
    var name = options[floorId]
    var num = ~~(10 * Math.random()) + 3
    for (var i = 0; i < num; i++) {

      var deviceName = name + '_device_' + (i + 1)

      addDevice(deviceName)
    }
  }

  function getDefaultStatus (obj) {
    var position = obj.position.clone()
    var scale = obj.scale.clone()
    var rotation = obj.rotation.clone()
    var rst = {
      position: position,
      scale: scale,
      rotation: rotation
    }

    return rst
  }

  // 添加设备按钮点击回调
  function clickHandle ({ name, row }) {
    // alert(name)
    // console.log('添加设备', name)
    if (IS_LOADING) return

    IS_LOADING = true

    var progressBar = new ProgressBar.Circle('#progress', {
      color: '#FCB03C',
      strokeWidth: 3,
      trailWidth: 1,
      text: {
        className: 'progressbar__label',
        value: '加载中'
      }
    })

    var mtlLoader = new THREE.MTLLoader()
    var loader = new THREE.OBJLoader()
    var path = './object/camera4/'
    mtlLoader.setPath(path).load('camera.mtl',
      function (materials) {
        materials.preload()
        loader.setMaterials(materials).setPath(path)

        loader.load('camera.obj',
          function (obj) {
            var scale = 0.08
            obj.name = name
            obj.userData.isDevice = true

            obj.scale.set(scale, scale, scale)

            obj._default = getDefaultStatus(obj)

            editor.execute(new AddObjectCommand(editor, obj))
            // editor.addObject(obj)

            container.remove(row)
            for (var i = rows.length - 1; i >= 0; i--) {
              var crow = rows[i]
              if (crow === row) {
                rows.slice(i, 1)
              }
            }
            IS_LOADING = false
            setTimeout(() => {
              progressBar.destroy()
            }, 500);
          },
          function (xhr) {
            var num = xhr.loaded / xhr.total
            // progressBar.animate(num, {
            //   duration: 500
            // })
            progressBar.set(num)


          },
          // onError callback
          function (err) {
            alert('load object error')
            console.error(err)
          }
        )
      }
    )

    // loader.load('./object/camera3/camera.obj',
    //   function (obj) {
    //     var scale = 0.08
    //     obj.name = name
    //     obj.userData.isDevice = true

    //     obj.scale.set(scale, scale, scale)

    //     editor.execute(new AddObjectCommand(editor, obj))
    //     // editor.addObject(obj)

    //     container.remove(row)
    //     for (var i = rows.length - 1; i >= 0; i--) {
    //       var crow = rows[i]
    //       if (crow === row) {
    //         rows.slice(i, 1)
    //       }
    //     }
    //     IS_LOADING = false
    //     setTimeout(() => {
    //       progressBar.destroy()
    //     }, 500);

    //   },
    //   // onProgress callback
    //   function (xhr) {
    //     // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //     var num = xhr.loaded / xhr.total

    //     // progressBar.animate(num, {
    //     //   duration: 500
    //     // })
    //     progressBar.set(num)


    //   },
    //   // onError callback
    //   function (err) {
    //     alert('load object error')
    //     console.error(err)
    //   }
    // )




    // var geometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1)
    // var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    // mesh.name = name
    // mesh.userData.isDevice = true

    // editor.execute(new AddObjectCommand(editor, mesh))

    // container.remove(row)

    // for (var i = rows.length - 1; i >= 0; i--) {
    //   var crow = rows[i]
    //   if (crow === row) {
    //     rows.slice(i, 1)
    //   }
    // }
  }

  return container
}


function getFloors () {
  var temp =
    'node_-2f_-4638|B2F,node_-1f_-4636|B1F,node_ground_-4658|ground,node_1f_-4640|1F,node_2f_-4642|2F,node_3f_-4644|3F,node_4f_-4646|4F,node_5f_-4648|5F,node_6f_-4650|6F,node_7f_-4652|7F,node_8f_-4654|8F,node_9f_-4656|9F'
  var list = temp.split(',')
  var floors = {}

  for (var i = 0; i < list.length; i++) {
    var re = list[i].split('|')

    floors[re[0]] = re[1]
  }
  return floors
}