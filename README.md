Rally Last Result By Test Set
============

![Title](https://raw.github.com/RallyApps/LastResultByTestSet/master/screenshots/title-screenshot.png)

## Overview

The Last Result by Test Set app shows the last test case result for each test case associated with a test set for a selected iteration. In Rally, a test set is a means of grouping and scheduling test cases. When each test case is run, a test case result is generated with a verdict for the test case.

## How to Use

### Running the App

If you want to start using the app immediately, create an Custom HTML app on your Rally dashboard. Then copy App.html from the deploy folder into the HTML text area. That's it, it should be ready to use. See [this](http://www.rallydev.com/help/use_apps#create) help link if you don't know how to create a dashboard page for Custom HTML apps.

Or you can just click [here](https://raw.github.com/RallyApps/LastResultByTestSet/master/deploy/App.html) to find the file and copy it into the custom HTML app.

### Using the App

This app shows the very latest test case result for each test case in a test set. The output is ordered by test set FormattedID, with the associated test cases also ordered by FormattedID.

By selecting a iteration from the drop-down menu, information about each test case in the test set is assembled for display in a grid format. You can click on the column headers to sort items in ascending or descending order. You can also click on the item formatted id link to take you to the detail page of the test case.

<b>Note:</b> If your test case is not associated with a test set, this app will not show any results for that test case. Additionally, if a test case result for a test case is not associated with a test set, the data for that test case result will not be shown.

## Customize this App

You're free to customize this app to your liking (see the License section for details). If you need to add any new Javascript or CSS files, make sure to update config.json so it will be included the next time you build the app.

This app uses the Rally SDK 1.32. The documentation can be found [here](http://developer.rallydev.com/help/app-sdk). 

Available Rakefile tasks are:

    rake build                      # Build a deployable app which includes all JavaScript and CSS resources inline
    rake clean                      # Clean all generated output
    rake debug                      # Build a debug version of the app, useful for local development
    rake deploy                     # Deploy an app to a Rally server
    rake deploy:debug               # Deploy a debug app to a Rally server
    rake deploy:info                # Display deploy information
    rake jslint                     # Run jslint on all JavaScript files used by this app, can be enabled by setting ENABLE_JSLINT=true.

## License

LastResultByTestSet is released under the MIT license. See the file [LICENSE](https://raw.github.com/RallyApps/LastResultByTestSet/master/LICENSE) for the full text.