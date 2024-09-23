import React, { useState, useEffect } from 'react';
import { Card, Select, Tabs, Button, Form, Progress, Typography, Row, Col, Space } from 'antd';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const characters = [
  {
    name: 'Jiyan',
    image: '/images/resonators/jiyan.png',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK', 'ATK%', 'Heavy Attack DMG Bonus'],
    energy: {
      range: [15, 40],
    },
  },
  {
    name: 'Changli',
    image: '/images/resonators/changli.png',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK', 'ATK%', 'Resonance Skill DMG Bonus'],
    energy: {
      range: [10, 20],
    },
  },
  {
    name: 'Jinhsi',
    image: '/images/resonators/jinhsi.png',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK%', 'Resonance Skill DMG Bonus', 'ATK'],
    energy: {
      range: [0, 35],
    },
  },
  {
    name: 'Xiangli Yao',
    image: '/images/resonators/xiangliyao.png',
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
    },
  },
  {
    name: 'Rover (Havoc)',
    image: '/images/resonators/rover-havoc.png',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK%', 'ATK'],
    energy: {
      range: [0, 20],
    },
  },
  {
    name: 'Zhezhi',
    image: '/images/resonators/zhezhi.png',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'Basic Attack DMG Bonus', 'ATK%', 'ATK'],
    energy: {
      range: [15, 35],
    },
  },
  {
    name: 'Calcharo',
    image: '/images/resonators/calcharo.png',
    stats: [
      'Energy Regen',
      'Crit. Rate',
      'Crit. DMG',
      'ATK',
      'ATK%',
      'Resonance Liberation DMG Bonus',
    ],
    energy: {
      range: [10, 40],
    },
  },
  {
    name: 'Lingyang',
    image: '/images/resonators/lingyang.png',
    stats: ['Energy Regen', 'Crit. Rate', 'Crit. DMG', 'ATK%', 'ATK'],
    energy: {
      range: [10, 25],
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
  <Form.Item label={`Attribute ${index + 1}`} style={{ marginBottom: '16px' }}>
    <Row gutter={8}>
      <Col span={16}>
        <Select
          placeholder="Select attribute"
          value={attribute.attribute}
          onChange={(value) => onChange(index, 'attribute', value)}>
          {Object.keys(attributes).map((attribute) => (
            <Option key={attribute} value={attribute}>
              {attribute}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={8}>
        <Select
          placeholder="Value"
          value={attribute.value}
          onChange={(value) => onChange(index, 'value', value)}
          disabled={!attribute.attribute}>
          {attribute.attribute &&
            attributes[attribute.attribute].map((value) => (
              <Option key={value} value={value.toString()}>
                {value}
              </Option>
            ))}
        </Select>
      </Col>
    </Row>
  </Form.Item>
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
  <Form layout="vertical">
    {echo.map((attribute, attributeIndex) => (
      <AttributeInput
        key={attributeIndex}
        index={attributeIndex}
        attribute={attribute}
        onChange={(attrIndex, field, value) => onChange(echoIndex, attrIndex, field, value)}
      />
    ))}
  </Form>
);

type ExtendedStatsType = Record<AttributeType, StatResult>;

const ResonatorEchoCalculator = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [activeTab, setActiveTab] = useState('0'); // Thêm state cho tab hiện tại
  const [echoes, setEchoes] = useState<
    Array<Array<{ attribute: AttributeType | ''; value: string }>>
  >(Array(5).fill(Array(5).fill({ attribute: '', value: '' })));
  const [results, setResults] = useState<ExtendedStatsType | {}>({});
  const [calculated, setCalculated] = useState(false);
  const sortedCharacters = characters.sort((a, b) => a.name.localeCompare(b.name));
  const selectedCharacterImage = sortedCharacters.find(
    (char) => char.name === selectedCharacter
  )?.image;

  useEffect(() => {
    if (selectedCharacter) {
      const savedData = localStorage.getItem(selectedCharacter);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setEchoes(parsedData.echoes);
        setResults(parsedData.results);
      } else {
        setEchoes(Array(5).fill(Array(5).fill({ attribute: '', value: '' })));
        setResults({});
      }
      setActiveTab('0'); // Đặt lại tab về Echo 1 khi chọn resonator mới
    }
  }, [selectedCharacter]);

  const handleEchoChange = (
    _echoIndex: number,
    attrIndex: number,
    field: string,
    value: string
  ) => {
    const newEchoes = echoes.map((echo, echoIndex) =>
      echoIndex === _echoIndex
        ? echo.map((attr, aIndex) => (aIndex === attrIndex ? { ...attr, [field]: value } : attr))
        : echo
    );
    setEchoes(newEchoes);
    saveData(newEchoes, results);
  };

  const calculateAmount = (energyRange: [number, number]): number => {
    const energyRegenValues = attributes['Energy Regen'];
    let A = 1;
    let B = 1;

    for (let i = 1; i <= 5; i++) {
      if (energyRegenValues[0] * i >= energyRange[0]) {
        A = i;
        break;
      }
    }

    for (let i = 1; i <= 5; i++) {
      if (energyRegenValues[energyRegenValues.length - 1] * i >= energyRange[1]) {
        B = i;
        break;
      }
    }

    return Math.max(A, B);
  };

  const calculateStats = () => {
    const character = characters.find((c) => c.name === selectedCharacter);
    if (!character) return;

    const amount = calculateAmount(character.energy.range as [number, number]);

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
          min = Math.min(...attrValues) * (5 - amount);
          max = Math.max(...attrValues) * (5 - amount);
        } else {
          min = Math.min(...attrValues) * 5;
          max = Math.max(...attrValues) * 5;
        }

        if (stat === 'Energy Regen') {
          [min, max] = character.energy.range;
        }
      }

      let status = 'Optimal';
      if (value < min) status = 'Too low';
      if (value > max) status = 'Too high';

      acc[stat as AttributeType] = { value, status, min, max };
      return acc;
    }, {} as ExtendedStatsType);

    setResults(stats);
    setCalculated(true);
    saveData(echoes, stats);
  };

  const saveData = (currentEchoes: typeof echoes, currentResults: typeof results) => {
    if (selectedCharacter) {
      const dataToSave = {
        echoes: currentEchoes,
        results: currentResults,
      };
      localStorage.setItem(selectedCharacter, JSON.stringify(dataToSave));
    }
  };

  const clearData = () => {
    if (selectedCharacter) {
      const confirmClear = window.confirm('Are you sure you want to clear the data?');
      if (confirmClear) {
        localStorage.removeItem(selectedCharacter);
        setEchoes(Array(5).fill(Array(5).fill({ attribute: '', value: '' })));
        setResults({});
        setCalculated(false);
      }
    }
  };

  const getProcessWidth = (value: number, min: number, max: number) => {
    if (value <= min) return 0;
    if (value >= max) return 100;
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <Card
      title="Resonator Echo Calculator"
      style={{
        maxWidth: '1200px',
        margin: '24px auto',
        position: 'relative',
      }}>
      <Row gutter={16}>
        <Col span={6}>
          {selectedCharacterImage && (
            <img
              alt={selectedCharacter}
              src={selectedCharacterImage}
              style={{ width: '100%', marginBottom: '16px', height: '357px', objectFit: 'cover' }}
            />
          )}
          <Form layout="vertical">
            <Form.Item label="Resonator">
              <Select
                style={{ marginBottom: '16px' }}
                placeholder="Select resonator"
                onChange={(value) => {
                  setSelectedCharacter(value);
                  // Reset results when changing resonator
                  setResults({});
                  setCalculated(false);
                }}>
                {sortedCharacters.map((char) => (
                  <Option key={char.name} value={char.name}>
                    {char.name}
                  </Option>
                ))}
              </Select>
              {selectedCharacter && (
                <Button
                  type="primary"
                  danger
                  onClick={clearData}
                  style={{ width: '100%', marginTop: '8px' }}>
                  Clear
                </Button>
              )}
            </Form.Item>
          </Form>
        </Col>

        <Col span={8}>
          {selectedCharacter && (
            <>
              <Tabs defaultActiveKey="0" activeKey={activeTab} onChange={setActiveTab}>
                {echoes.map((_, index) => (
                  <TabPane tab={`Echo ${index + 1}`} key={index}>
                    <EchoInput echoIndex={index} echo={echoes[index]} onChange={handleEchoChange} />
                  </TabPane>
                ))}
              </Tabs>
              <Button
                type="primary"
                onClick={calculateStats}
                disabled={!selectedCharacter}
                style={{ width: '100%', marginTop: '8px' }}>
                Calculate
              </Button>
            </>
          )}
        </Col>

        {selectedCharacter && calculated && Object.keys(results).length > 0 && (
          <Col span={10}>
            <Card style={{ backgroundColor: '#f0f2f5' }}>
              <Title level={4}>Result:</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(results as ExtendedStatsType)
                  .filter(([_, result]) => result.min !== 0 || result.max !== 0)
                  .map(([stat, result]) => (
                    <div key={stat}>
                      <Row justify="space-between">
                        <Text strong>{stat}:</Text>
                        <Text type={result.status === 'Optimal' ? 'success' : 'danger'}>
                          {result.value.toFixed(1)} ({result.status})
                        </Text>
                      </Row>
                      <Progress
                        percent={getProcessWidth(result.value, result.min, result.max)}
                        status={result.status === 'Optimal' ? 'success' : 'exception'}
                        showInfo={false}
                      />
                      <Row justify="space-between" style={{ fontSize: '12px', color: '#888' }}>
                        <Text>{result.min.toFixed(1)}</Text>
                        <Text>{result.value.toFixed(1)}</Text>
                        <Text>{result.max.toFixed(1)}</Text>
                      </Row>
                    </div>
                  ))}
              </Space>
            </Card>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default ResonatorEchoCalculator;
