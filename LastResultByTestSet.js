function LastResultByTestSet() {
	this.display = function() {
		var wait = null, table;
		var noQualifiers = "There were no qualifying TestCaseResults in any TestSet for the selected release";

		function showResults(results) {
			if (wait) {
				wait.hide();
				wait = null;
			}
			if (results.tsi.length === 0) {
				tableHolder.innerHTML = "No TestSets associated with the selected iteration were found";
				return;
			}

			function byFormattedID(a, b) {
				var cix = 0;   // comparison index
				if (a.FormattedID < b.FormattedID) {
					cix = -1;
				}
				else if (a.FormattedID === b.FormattedID) {
					cix = 0;
				}
				else /* (a.FormattedID  >  b.FormattedID) */ {
					cix = 1;
				}
				return cix;
			}

			function byTestRunDate(a, b) {
				var cix = 0;   // comparison index
				if (a.Date < b.Date) {
					cix = -1;
				}
				else if (a.Date === b.Date) {
					cix = 0;
				}
				else /* (a.Date  >  b.Date) */ {
					cix = 1;
				}
				return cix;
			}

			function assembleLastTestCaseResult(testSet, testCase, testCaseResults) {
				var lastTestCaseResult = testCaseResults.sort(byTestRunDate).pop();
				var testSetIdent = testSet.FormattedID + " " + testSet.Name;
				var linkConfig = {item : {FormattedID: testCase.FormattedID, "_ref" : testCase._ref}};
				var testCaseLink = new rally.sdk.ui.basic.Link(linkConfig);
				var testCaseIdent = testCaseLink.renderToHtml() + " " + testCase.Name;
				var dateFormat = "yyyy-MM-dd HH:mm:ss";
				var tcrDate = rally.sdk.util.DateTime.format(lastTestCaseResult.Date, dateFormat);
				// assemble an object with info relevant to the last test case result
				var ltcr = {'TestSet'    : testSetIdent,
					'TestCase'   : testCaseIdent,
					'LastResult' : lastTestCaseResult.Verdict,
					'LastRun'    : tcrDate
				};
				return ltcr;
			}

			var testCase = null;
			var testCases = [];
			var testCaseResult = null;
			var testCaseResults = [];
			var lastTestCaseResult = null;
			var lastTestCaseResults = [];   // container for lastTestCaseResult objects
			var tcr;
			var i,j;

			var testSetFormattedID = null;
			var testCaseFormattedID = null;

			// do a one-time pass through results.tcr and build a 2 level dict
			// of tstc_tcrs[TestSet][TestCase] = [TestCaseResults] items for easy direct access later
			var tstc_tcrs = {};
			for (i = 0; i < results.tcr.length; i++) {
				tcr = results.tcr[i];
				testSetFormattedID = tcr.TestSet.FormattedID;
				testCaseFormattedID = tcr.TestCase.FormattedID;
				if (! tstc_tcrs.hasOwnProperty(testSetFormattedID)) {
					tstc_tcrs[testSetFormattedID] = {};
				}
				if (! tstc_tcrs[testSetFormattedID].hasOwnProperty(testCaseFormattedID)) {
					tstc_tcrs[testSetFormattedID][testCaseFormattedID] = [];
				}
				tstc_tcrs[testSetFormattedID][testCaseFormattedID].push(tcr);
			}

			// define a function that when given a TestSet.FormattedID and a TestCase.FormattedID
			// will return the list of TestCaseResults if there are any for that combination
			var getTestCaseResults = function(ts_fmtID, tc_fmtID) {
				var testCaseResults = [];
				if (tstc_tcrs.hasOwnProperty(ts_fmtID) && tstc_tcrs[ts_fmtID].hasOwnProperty(tc_fmtID)) {
					testCaseResults = tstc_tcrs[ts_fmtID][tc_fmtID];
				}
				return testCaseResults;
			};

			//console.log("query returned " + results.tsi.length + " items");
			for (i = 0; i < results.tsi.length; i++) {
				testSet = results.tsi[i];
				//console.log(testSet.FormattedID);
				testCases = testSet.TestCases.sort(byFormattedID);
				for (j = 0; j < testCases.length; j++) {
					testCase = testCases[j];
					//console.log("----> " + testCase.FormattedID);
					testCaseResults = getTestCaseResults(testSet.FormattedID, testCase.FormattedID);
					if (testCaseResults.length > 0) {
						lastTestCaseResult = assembleLastTestCaseResult(testSet, testCase, testCaseResults);
						lastTestCaseResults.push(lastTestCaseResult);
					}
				}
			}

			var tableConfig = {
				columnKeys   : ['TestSet',  'TestCase',  'LastResult',         'LastRun'         ],
				columnHeaders: ['Test Set', 'Test Case', 'Last Result in Set', 'Last Run in Set' ],
				columnWidths : ['220px',    '280px',     '120px',              '150px'           ]
			};

			if (table) {
				table.destroy();
			}
			table = new rally.sdk.ui.Table(tableConfig);
			table.addRows(lastTestCaseResults);
			table.display(tableHolder);
			if (lastTestCaseResults.length === 0) {
				rally.sdk.ui.AppHeader.showMessage("info", noQualifiers, 5000);
			}
		}

		function runMainQuery() {
			var selectedIteration = iterDropdown.getSelectedName();
			var queryConfigs = [
				{ key  : 'tsi',
					type : 'testset',
					fetch: 'FormattedID,Name,TestCases,TestCase',
					query: '(Iteration.Name = "' + selectedIteration + '")',
					order: 'FormattedID'
				},
				{
					key  : 'tcr',
					type : 'testcaseresult',
					fetch: 'TestCase,TestSet,FormattedID,Verdict,Date',
					query: '(TestSet.Iteration.Name = "' + selectedIteration + '")',
					order: 'TestSet,TestCase,Date'
				}
			];

			tableHolder.innerHTML = "";
			wait = new rally.sdk.ui.basic.Wait({});
			wait.display(tableHolder);

			rallyDataSource.findAll(queryConfigs, showResults);
		}

		rally.sdk.ui.AppHeader.setHelpTopic("239");
		rally.sdk.ui.AppHeader.showPageTools(true);

		var tableHolder = document.getElementById('table');

		var rallyDataSource =
				new rally.sdk.data.RallyDataSource('__WORKSPACE_OID__',
						'__PROJECT_OID__',
						'__PROJECT_SCOPING_UP__',
						'__PROJECT_SCOPING_DOWN__');

		var iterConfig = { label: 'Select an iteration: ',
			showLabel: true,
			labelPosition: "before"
		};
		iterDropdown = new rally.sdk.ui.IterationDropdown(iterConfig, rallyDataSource);
		iterDropdown.display(document.getElementById("iterations"), runMainQuery);
	}; 
}
