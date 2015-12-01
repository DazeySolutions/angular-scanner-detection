AngularJS Scanner Detection
========================

Angular Scanner Detection is a directive to detect when a user uses a scanner (barcode, QR Code...) instead of a keyboard, and call specific callbacks.


How use it
----------
Add 'scanner.detection' to includes:

    var app = angular.module('app', ['scanner.detection']);
    
Setup options: 

    $scope.scan_options = {
    	onComplete: function(){...}, //or false 
        onError: function(){...}, //or false 
        onReceive: function(){...}, //or false 
        timeBeforeScanTest: 100,
        avgTimeByChar: 30,
        minLength: 6,
        endChar: [9, 13],
        startChar: [],
        scanButtonKeyCode: false, 
        scanButtonLongPressThreshold: 3,
        onScanButtonLongPressed: function(){...} //or false
    };
    
Add directive to html:

    <input type="text" ng-model=".." ng-scanner-detect="scan_options">


Options
-------
###onComplete
Default: false  
Callback after detection of a successful scanning
###onError
Default: false  
Callback after detection of a unsuccessful scanning (scanned string in parameter)
###onReceive
Default: false  
Callback after receiving and processing a char (scanned char in parameter)
###onScanButtonLongPressed
Default: false  
Callback after detection of a successfull scan while the scan button was pressed and held down. This can only be used if the scan button behaves as a key itself (see scanButtonKeyCode). This long press event can be used to add a secondary action. For example, if the primary action is to count some items with barcodes (e.g. products at goods-in), it is comes very handy if a number pad pops up on the screen when the scan button is held. Large number can then be easily typed it instead of scanning fifty times in a row. 
Note: this option requires scanButtonKeyCode to be set to a valid key code!
###timeBeforeScanTest
Default: 100  
Wait duration (ms) after keypress event to check if scanning is finished
###avgTimeByChar
Default: 30  
Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
###minLength
Default: 6  
Minimum length for a scanning
###endChar
Default: [9,13]  
Chars to remove and means end of scanning
###startChar
Default: []  
Chars to remove and means start of scanning
###scanButtonKeyCode
Default: false  
Key code of the scanner hardware button (if the scanner button a acts as a key itself). Knowing this key code is important, because it is not part of the scanned code and must be ignored. On the other hand, knowing it can be usefull: pressing the button multiple times fast normally results just in one scan, but you still could count the number of times pressed, allowing the user to input quantities this way (typical use case would be counting product at goods-in). 
###scanButtonLongPressThreshold
Default: 3  
You can let the user perform some special action by pressing and holding the scan button. In this case the button will issue multiple keydown events. This parameter sets, how many sequential events should be interpreted as holding the button down.  

Browser compatibility
---------------------
On old IE browser (IE<9), `Date.now()` and `Array.indexOf()` are not implemented.  
If you plan to use this plugin on these browsers, please add jquery.scannerdetection.compatibility.js file before the plugin.
