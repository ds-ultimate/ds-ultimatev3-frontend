
let debugbarAdded = false

export default function Debugbar() {
  if(process.env.REACT_APP_RENDER_DEBUGBAR !== "true") {
    return (
        <>
        </>
    )
  }
  const inlineCssContents = "<style> .phpdebugbar pre.sf-dump { display: block; white-space: pre; padding: 5px; overflow: initial !important; } .phpdebugbar pre.sf-dump:after { content: \"\"; visibility: hidden; display: block; height: 0; clear: both; } .phpdebugbar pre.sf-dump span { display: inline; } .phpdebugbar pre.sf-dump a { text-decoration: none; cursor: pointer; border: 0; outline: none; color: inherit; } .phpdebugbar pre.sf-dump img { max-width: 50em; max-height: 50em; margin: .5em 0 0 0; padding: 0; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAHUlEQVQY02O8zAABilCaiQEN0EeA8QuUcX9g3QEAAjcC5piyhyEAAAAASUVORK5CYII=) #D3D3D3; } .phpdebugbar pre.sf-dump .sf-dump-ellipsis { display: inline-block; overflow: visible; text-overflow: ellipsis; max-width: 5em; white-space: nowrap; overflow: hidden; vertical-align: top; } .phpdebugbar pre.sf-dump .sf-dump-ellipsis+.sf-dump-ellipsis { max-width: none; } .phpdebugbar pre.sf-dump code { display:inline; padding:0; background:none; } .sf-dump-public.sf-dump-highlight, .sf-dump-protected.sf-dump-highlight, .sf-dump-private.sf-dump-highlight, .sf-dump-str.sf-dump-highlight, .sf-dump-key.sf-dump-highlight { background: rgba(111, 172, 204, 0.3); border: 1px solid #7DA0B1; border-radius: 3px; } .sf-dump-public.sf-dump-highlight-active, .sf-dump-protected.sf-dump-highlight-active, .sf-dump-private.sf-dump-highlight-active, .sf-dump-str.sf-dump-highlight-active, .sf-dump-key.sf-dump-highlight-active { background: rgba(253, 175, 0, 0.4); border: 1px solid #ffa500; border-radius: 3px; } .phpdebugbar pre.sf-dump .sf-dump-search-hidden { display: none !important; } .phpdebugbar pre.sf-dump .sf-dump-search-wrapper { font-size: 0; white-space: nowrap; margin-bottom: 5px; display: flex; position: -webkit-sticky; position: sticky; top: 5px; } .phpdebugbar pre.sf-dump .sf-dump-search-wrapper > * { vertical-align: top; box-sizing: border-box; height: 21px; font-weight: normal; border-radius: 0; background: #FFF; color: #757575; border: 1px solid #BBB; } .phpdebugbar pre.sf-dump .sf-dump-search-wrapper > input.sf-dump-search-input { padding: 3px; height: 21px; font-size: 12px; border-right: none; border-top-left-radius: 3px; border-bottom-left-radius: 3px; color: #000; min-width: 15px; width: 100%; } .phpdebugbar pre.sf-dump .sf-dump-search-wrapper > .sf-dump-search-input-next, .phpdebugbar pre.sf-dump .sf-dump-search-wrapper > .sf-dump-search-input-previous { background: #F2F2F2; outline: none; border-left: none; font-size: 0; line-height: 0; } .phpdebugbar pre.sf-dump .sf-dump-search-wrapper > .sf-dump-search-input-next { border-top-right-radius: 3px; border-bottom-right-radius: 3px; } .phpdebugbar pre.sf-dump .sf-dump-search-wrapper > .sf-dump-search-input-next > svg, .phpdebugbar pre.sf-dump .sf-dump-search-wrapper > .sf-dump-search-input-previous > svg { pointer-events: none; width: 12px; height: 12px; } .phpdebugbar pre.sf-dump .sf-dump-search-wrapper > .sf-dump-search-count { display: inline-block; padding: 0 5px; margin: 0; border-left: none; line-height: 21px; font-size: 12px; }.phpdebugbar pre.sf-dump, .phpdebugbar pre.sf-dump .sf-dump-default{word-wrap: break-word; white-space: pre-wrap; word-break: normal}.phpdebugbar pre.sf-dump .sf-dump-num{font-weight:bold; color:#1299DA}.phpdebugbar pre.sf-dump .sf-dump-const{font-weight:bold}.phpdebugbar pre.sf-dump .sf-dump-str{font-weight:bold; color:#3A9B26}.phpdebugbar pre.sf-dump .sf-dump-note{color:#1299DA}.phpdebugbar pre.sf-dump .sf-dump-ref{color:#7B7B7B}.phpdebugbar pre.sf-dump .sf-dump-public{color:#000000}.phpdebugbar pre.sf-dump .sf-dump-protected{color:#000000}.phpdebugbar pre.sf-dump .sf-dump-private{color:#000000}.phpdebugbar pre.sf-dump .sf-dump-meta{color:#B729D9}.phpdebugbar pre.sf-dump .sf-dump-key{color:#3A9B26}.phpdebugbar pre.sf-dump .sf-dump-index{color:#1299DA}.phpdebugbar pre.sf-dump .sf-dump-ellipsis{color:#A0A000}.phpdebugbar pre.sf-dump .sf-dump-ns{user-select:none;}.phpdebugbar pre.sf-dump .sf-dump-ellipsis-note{color:#1299DA}</style>\n"
  const starterScriptContents =
      "var debugbarScript = document.querySelector('#debugbarExternalScript');\n" +
      "debugbarScript.addEventListener('load', function() {\n" +
      "  var phpdebugbar = new PhpDebugBar.DebugBar();\n" +
      "  phpdebugbar.addIndicator(\"php_version\", new PhpDebugBar.DebugBar.Indicator({\"icon\":\"code\",\"tooltip\":\"PHP Version\"}), \"right\");\n" +
      "  phpdebugbar.addTab(\"messages\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"list-alt\",\"title\":\"Messages\", \"widget\": new PhpDebugBar.Widgets.MessagesWidget()}));\n" +
      "  phpdebugbar.addIndicator(\"time\", new PhpDebugBar.DebugBar.Indicator({\"icon\":\"clock-o\",\"tooltip\":\"Request Duration\"}), \"right\");\n" +
      "  phpdebugbar.addTab(\"timeline\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"tasks\",\"title\":\"Timeline\", \"widget\": new PhpDebugBar.Widgets.TimelineWidget()}));\n" +
      "  phpdebugbar.addIndicator(\"memory\", new PhpDebugBar.DebugBar.Indicator({\"icon\":\"cogs\",\"tooltip\":\"Memory Usage\"}), \"right\");\n" +
      "  phpdebugbar.addTab(\"exceptions\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"bug\",\"title\":\"Exceptions\", \"widget\": new PhpDebugBar.Widgets.ExceptionsWidget()}));\n" +
      "  phpdebugbar.addTab(\"views\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"leaf\",\"title\":\"Views\", \"widget\": new PhpDebugBar.Widgets.TemplatesWidget()}));\n" +
      "  phpdebugbar.addTab(\"route\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"share\",\"title\":\"Route\", \"widget\": new PhpDebugBar.Widgets.HtmlVariableListWidget()}));\n" +
      "  phpdebugbar.addIndicator(\"currentroute\", new PhpDebugBar.DebugBar.Indicator({\"icon\":\"share\",\"tooltip\":\"Route\"}), \"right\");\n" +
      "  phpdebugbar.addTab(\"queries\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"database\",\"title\":\"Queries\", \"widget\": new PhpDebugBar.Widgets.LaravelSQLQueriesWidget()}));\n" +
      "  phpdebugbar.addTab(\"models\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"cubes\",\"title\":\"Models\", \"widget\": new PhpDebugBar.Widgets.HtmlVariableListWidget()}));\n" +
      "  phpdebugbar.addTab(\"gate\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"list-alt\",\"title\":\"Gate\", \"widget\": new PhpDebugBar.Widgets.MessagesWidget()}));\n" +
      "  phpdebugbar.addTab(\"session\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"archive\",\"title\":\"Session\", \"widget\": new PhpDebugBar.Widgets.VariableListWidget()}));\n" +
      "  phpdebugbar.addTab(\"request\", new PhpDebugBar.DebugBar.Tab({\"icon\":\"tags\",\"title\":\"Request\", \"widget\": new PhpDebugBar.Widgets.HtmlVariableListWidget()}));\n" +
      "  phpdebugbar.setDataMap({\n" +
      "  \"php_version\": [\"php.version\", ],\n" +
      "  \"messages\": [\"messages.messages\", []],\n" +
      "  \"messages:badge\": [\"messages.count\", null],\n" +
      "  \"time\": [\"time.duration_str\", '0ms'],\n" +
      "  \"timeline\": [\"time\", {}],\n" +
      "  \"memory\": [\"memory.peak_usage_str\", '0B'],\n" +
      "  \"exceptions\": [\"exceptions.exceptions\", []],\n" +
      "  \"exceptions:badge\": [\"exceptions.count\", null],\n" +
      "  \"views\": [\"views\", []],\n" +
      "  \"views:badge\": [\"views.nb_templates\", 0],\n" +
      "  \"route\": [\"route\", {}],\n" +
      "  \"currentroute\": [\"route.uri\", ],\n" +
      "  \"queries\": [\"queries\", []],\n" +
      "  \"queries:badge\": [\"queries.nb_statements\", 0],\n" +
      "  \"models\": [\"models.data\", {}],\n" +
      "  \"models:badge\": [\"models.count\", 0],\n" +
      "  \"gate\": [\"gate.messages\", []],\n" +
      "  \"gate:badge\": [\"gate.count\", null],\n" +
      "  \"session\": [\"session\", {}],\n" +
      "  \"request\": [\"request\", {}]\n" +
      "});\n" +
      "  phpdebugbar.restoreState();\n" +
      "  phpdebugbar.ajaxHandler = new PhpDebugBar.AjaxHandler(phpdebugbar, undefined, true);\n" +
      "  phpdebugbar.ajaxHandler.bindToFetch();\n" +
      "  phpdebugbar.ajaxHandler.bindToXHR();\n" +
      "  phpdebugbar.setOpenHandler(new PhpDebugBar.OpenHandler({\"url\":\"https:\\/\\/api.test.ds-ultimate.de\\/_debugbar\\/open\"}));\n" +
      "});"

  if(! debugbarAdded) {
    debugbarAdded = true
    let externalCss = document.createElement("link")
    externalCss.rel = "stylesheet"
    externalCss.type = "text/css"
    externalCss.href = "https://api.test.ds-ultimate.de/_debugbar/assets/stylesheets?v=1657531602&theme=auto"
    let externalScript = document.createElement("script")
    externalScript.id = "debugbarExternalScript"
    externalScript.src = "https://api.test.ds-ultimate.de/_debugbar/assets/javascript?v=1657531602"
    let inlineCss = document.createElement("style")
    inlineCss.innerHTML = inlineCssContents
    let starterScript = document.createElement("script")
    starterScript.innerHTML = starterScriptContents
    document.head.appendChild(externalCss)
    document.head.appendChild(externalScript)

    document.body.appendChild(inlineCss)
    document.body.appendChild(starterScript)
  }

  return (
      <>
      </>
  )
}
