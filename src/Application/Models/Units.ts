export default class Units
{
    public static readonly UnitToMetersByValue: Record<number, number> = {
        0: 1,                 // No unit system (treat as 1:1)
        1: 1e-6,              // Microns
        2: 1e-3,              // Millimeters
        3: 1e-2,              // Centimeters
        4: 1,                 // Meters
        5: 1e3,               // Kilometers
        6: 2.54e-8,           // Microinches
        7: 2.54e-5,           // Mils
        8: 0.0254,            // Inches
        9: 0.3048,            // Feet  (NOTE: your table had 0.3408; correct is 0.3048)
        10: 1609.344,         // Miles
        11: 1,                // Custom (unknown; treat as 1 unless you have custom scale)
        12: 1e-10,            // Angstroms
        13: 1e-9,             // Nanometers
        14: 1e-1,             // Decimeters
        15: 1e1,              // Dekameters
        16: 1e2,              // Hectometers
        17: 1e6,              // Megameters
        18: 1e9,              // Gigameters
        19: 0.9144,           // Yards
        20: 0.0254 / 72,      // Printer point
        21: 0.0254 / 6,       // Printer pica
        22: 1852,             // Nautical mile
        23: 1.4959787e11,     // Astronomical unit
        24: 9.46073e15,       // Lightyears
        25: 3.08567758e16,    // Parsecs
    }

    public static readonly UnitToMetersByName: Record<string, number> = {
      // be lenient with casing / synonyms
      "none": 1,
      "microns": 1e-6,
      "micrometers": 1e-6,
      "millimeters": 1e-3,
      "millimetres": 1e-3,
      "centimeters": 1e-2,
      "centimetres": 1e-2,
      "meters": 1,
      "metres": 1,
      "kilometers": 1e3,
      "kilometres": 1e3,
      "microinches": 2.54e-8,
      "mils": 2.54e-5,
      "inches": 0.0254,
      "feet": 0.3048,
      "miles": 1609.344,
      "angstroms": 1e-10,
      "nanometers": 1e-9,
      "decimeters": 1e-1,
      "dekameters": 1e1,
      "hectometers": 1e2,
      "megameters": 1e6,
      "gigameters": 1e9,
      "yards": 0.9144,
      "printer point": 0.0254 / 72,
      "printer pica": 0.0254 / 6,
      "nautical mile": 1852,
      "astronomical": 1.4959787e11,
      "astronomical unit": 1.4959787e11,
      "lightyears": 9.46073e15,
      "parsecs": 3.08567758e16,
    }
}