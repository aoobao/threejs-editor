/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function (editor) {

	var strings = editor.strings;
	var signals = editor.signals

	var container = new UI.TabbedPanel();
	container.setId('sidebar');

	var select = new UI.Span().add(
		new Sidebar.Select(editor)
	)

	var scene = new UI.Span().add(
		new Sidebar.Scene(editor),
		new Sidebar.Properties(editor),
		new Sidebar.Animation(editor)
		// new Sidebar.Script(editor)
	);

	var project = new Sidebar.Project(editor);

	var settings = new UI.Span().add(
		new Sidebar.Settings(editor),
		new Sidebar.History(editor)
	);

	container.addTab('select', strings.getKey('sidebar/select'), select)

	container.addTab('scene', strings.getKey('sidebar/scene'), scene);
	// container.addTab('project', strings.getKey('sidebar/project'), project);
	container.addTab('settings', strings.getKey('sidebar/settings'), settings);


	container.select('select');

	// 物体选中,切换到scene标签
	signals.objectSelected.add(function (obj) {
		// console.log(obj)
		if (obj) {
			container.select('scene')
		}

	})


	return container;

};
