// Javascript for the Groove Scribe HTML application

// merge 2 kick arrays
//  4 possible states
//  false   (off)
//  constant_ABC_KI_Normal
//  constant_ABC_KI_SandK
//  constant_ABC_KI_Splash
function merge_kick_arrays(primary_kick_array, secondary_kick_array) {
    var new_kick_array = [];

    for (var i in primary_kick_array) {

        switch (primary_kick_array[i]) {
            case false:
                new_kick_array.push(secondary_kick_array[i]);
                break;

            case constant_ABC_KI_SandK:
                new_kick_array.push(constant_ABC_KI_SandK);
                break;

            case constant_ABC_KI_Normal:
                if (secondary_kick_array[i] == constant_ABC_KI_SandK ||
                    secondary_kick_array[i] == constant_ABC_KI_Splash)
                    new_kick_array.push(constant_ABC_KI_SandK);
                else
                    new_kick_array.push(constant_ABC_KI_Normal);
                break;

            case constant_ABC_KI_Splash:
                if (secondary_kick_array[i] == constant_ABC_KI_Normal ||
                    secondary_kick_array[i] == constant_ABC_KI_SandK)
                    new_kick_array.push(constant_ABC_KI_SandK);
                else
                    new_kick_array.push(constant_ABC_KI_Splash);
                break;

            default:
                console.log("bad case in merge_kick_arrays()");
                new_kick_array.push(primary_kick_array[i]);
                break;
        }
    }

    return new_kick_array;
}