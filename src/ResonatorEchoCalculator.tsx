// @ts-ignore
import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  // @ts-ignore
} from '@/components/ui/Select';
// @ts-ignore
import { Button } from '@/components/ui/Button';
// @ts-ignore
import { Label } from '@/components/ui/Label';

const characters = [
  {
    name: 'Jiyan',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK', 'ATK%', 'Heavy Attack DMG Bonus'],
    energy: {
      range: [15, 40],
      amount: [3, 4],
    },
  },
  {
    name: 'Changli',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK', 'ATK%', 'Resonance Skill DMG Bonus'],
    energy: {
      range: [10, 20],
      amount: [2, 2],
    },
  },
  {
    name: 'Jinhsi',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK', 'ATK%', 'Resonance Skill DMG Bonus'],
    energy: {
      range: [0, 35],
      amount: [0, 3],
    },
  },
  {
    name: 'Xiangli Yao',
    stats: [
      'Energy Regen',
      'Crit. Rate',
      'Crit. DMG',
      'ATK',
      'ATK%',
      'Resonance Liberation DMG Bonus',
    ],
    energy: {
      range: [0, 30],
      amount: [0, 3],
    },
  },
  {
    name: 'Rover',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK', 'ATK%'],
    energy: {
      range: [0, 20],
      amount: [0, 2],
    },
  },
  {
    name: 'Zhezhi',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK', 'ATK%', 'Basic Attack DMG Bonus'],
    energy: {
      range: [15, 35],
      amount: [3, 3],
    },
  },
];

type AttributeType = keyof typeof attributes;

type StatResult = {
  value: number;
  status: string;
  min: number;
  max: number;
};

const attributes = {
  ATK: [30, 40, 50, 60, 70],
  'ATK%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  DEF: [30, 40, 50, 60, 70],
  'DEF%': [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  HP: [320, 360, 390, 430, 470, 510, 540, 580],
  'HP%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'Crit. Rate': [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  'Crit. DMG': [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
  'Energy Regen': [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
  'Resonance Skill DMG Bonus': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'Basic Attack DMG Bonus': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'Heavy Attack DMG Bonus': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'Resonance Liberation DMG Bonus': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
} as const;

const AttributeInput = ({
  index,
  attribute,
  onChange,
}: {
  index: number;
  attribute: { attribute: AttributeType | ''; value: string };
  onChange: (index: number, field: string, value: string) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor={`attribute-${index}`}>Attribute {index + 1}</Label>
    <div className="flex space-x-2">
      <Select
        onValueChange={(value: string) => onChange(index, 'attribute', value)}
        value={attribute.attribute}>
        <SelectTrigger
          id={`attribute-${index}`}
          className="w-2/3 bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
          <SelectValue placeholder="Select attribute" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {Object.keys(attributes).map((attr) => (
            <SelectItem key={attr} value={attr}>
              {attr}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value: string) => onChange(index, 'value', value)}
        value={attribute.value}
        disabled={!attribute.attribute}>
        <SelectTrigger className="w-1/3 bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
          <SelectValue placeholder="Value" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {attribute.attribute &&
            attributes[attribute.attribute].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const EchoInput = ({
  echoIndex,
  echo,
  onChange,
}: {
  echoIndex: number;
  echo: Array<{ attribute: AttributeType | ''; value: string }>;
  onChange: (echoIndex: number, attrIndex: number, field: string, value: string) => void;
}) => (
  <div className="space-y-2">
    {echo.map((attribute, attrIndex) => (
      <AttributeInput
        key={attrIndex}
        index={attrIndex}
        attribute={attribute}
        onChange={(attrIndex, field, value) => onChange(echoIndex, attrIndex, field, value)}
      />
    ))}
  </div>
);

type ExtendedStatsType = Record<AttributeType, StatResult>;

const ResonatorEchoCalculator = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [echoes, setEchoes] = useState<
    Array<Array<{ attribute: AttributeType | ''; value: string }>>
  >(Array(5).fill(Array(5).fill({ attribute: '', value: '' })));
  const [results, setResults] = useState<ExtendedStatsType | {}>({});

  useEffect(() => {
    if (selectedCharacter) {
      setEchoes(Array(5).fill(Array(5).fill({ attribute: '', value: '' })));
      setResults({});
    }
  }, [selectedCharacter]);

  const handleEchoChange = (echoIndex: number, attrIndex: number, field: string, value: string) => {
    const newEchoes = echoes.map((echo, eIndex) =>
      eIndex === echoIndex
        ? echo.map((attr, aIndex) => (aIndex === attrIndex ? { ...attr, [field]: value } : attr))
        : echo
    );
    setEchoes(newEchoes);
  };

  const calculateStats = () => {
    const character = characters.find((c) => c.name === selectedCharacter);
    if (!character) return;

    const stats = Object.keys(attributes).reduce((acc, stat) => {
      const value = echoes.flat().reduce((sum, attr) => {
        if (attr.attribute === stat) {
          return sum + parseFloat(attr.value || '0');
        }
        return sum;
      }, 0);

      let min = 0;
      let max = 0;

      if (character.stats.includes(stat)) {
        const attrValues = attributes[stat as AttributeType];
        const isExtraStat = stat === character.stats[character.stats.length - 1];

        if (isExtraStat) {
          min = Math.min(...attrValues) * (5 - character.energy.amount[1]);
          max = Math.max(...attrValues) * (5 - character.energy.amount[0]);
        } else {
          min = Math.min(...attrValues) * 5;
          max = Math.max(...attrValues) * 5;
        }

        // Xử lý phạm vi cụ thể cho Energy Regen
        if (stat === 'Energy Regen') {
          [min, max] = character.energy.range;
        }
      }

      let status = 'Optimal';
      if (value < min) status = 'Too Low';
      if (value > max) status = 'Too High';

      acc[stat as AttributeType] = { value, status, min, max };
      return acc;
    }, {} as ExtendedStatsType);

    setResults(stats);
  };

  const getProcessWidth = (value: number, min: number, max: number) => {
    if (value <= min) return 0;
    if (value >= max) return 100;
    return ((value - min) / (max - min)) * 100;
  };

  const getProcessColor = (status: string) => {
    switch (status) {
      case 'Optimal':
        return 'bg-green-500';
      case 'Too Low':
      case 'Too High':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <Card className="w-full max-w-[500px] mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="text-2xl font-bold">Resonator Echo Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="character-select"
              className="text-sm font-medium text-gray-700 mb-1 block">
              Select Character
            </Label>
            <Select onValueChange={(value: string) => setSelectedCharacter(value)}>
              <SelectTrigger
                id="character-select"
                className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
                <SelectValue placeholder="Select a character" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {characters.map((char) => (
                  <SelectItem key={char.name} value={char.name}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCharacter && (
            <div className="space-y-4">
              {echoes.map((echo, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-2">Echo {index + 1}</h4>
                  <EchoInput echoIndex={index} echo={echo} onChange={handleEchoChange} />
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={calculateStats}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            disabled={!selectedCharacter}>
            Calculate
          </Button>

          {Object.keys(results).length > 0 && (
            <div className="mt-6 bg-gray-100 p-4 rounded-md">
              <h3 className="text-xl font-bold mb-3">Results:</h3>
              <div className="space-y-4">
                {Object.entries(results as ExtendedStatsType)
                  .filter(([_, result]) => result.min !== 0 || result.max !== 0)
                  .map(([stat, result]) => (
                    <div key={stat} className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stat}:</span>
                        <span
                          className={`${
                            result.status === 'Optimal' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {result.value.toFixed(1)} ({result.status})
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                          <div
                            style={{
                              width: `${getProcessWidth(result.value, result.min, result.max)}%`,
                            }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProcessColor(
                              result.status
                            )}`}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{result.min.toFixed(1)}</span>
                          <span>{result.value.toFixed(1)}</span>
                          <span>{result.max.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResonatorEchoCalculator;
