'use client'

import type { ReactElement } from 'react'

import {
  ActiveDot,
  Dot,
  EvilLineChart,
  Grid,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from '@/components/evilcharts/charts/line-chart'
import type { ChartConfig } from '@/components/evilcharts/ui/chart'

const drawRhythmData: Record<string, unknown>[] = [
  { phase: 'Start', preset: 12, drawflow: 10 },
  { phase: 'Frame', preset: 34, drawflow: 28 },
  { phase: 'Dry-in', preset: 54, drawflow: 49 },
  { phase: 'Rough-in', preset: 54, drawflow: 66 },
  { phase: 'Finish', preset: 78, drawflow: 82 },
  { phase: 'Takeout', preset: 96, drawflow: 95 },
]

const drawRhythmConfig = {
  preset: {
    label: 'Preset calendar',
    colors: {
      light: ['rgb(8 9 10 / 32%)', 'rgb(8 9 10 / 18%)'],
    },
  },
  drawflow: {
    label: 'DrawFlow milestone availability',
    colors: {
      light: ['#8dff00', '#96ec18'],
    },
  },
} satisfies ChartConfig

export function FairlendPartnerConstructionChart(): ReactElement {
  return (
    <div className="partner-construction__chart-panel">
      <div className="partner-construction__chart-copy">
        <span className="partner-construction__chart-eyebrow">Draw rhythm model</span>
        <h3 className="partner-construction__chart-title">
          A better draw plan follows verified progress, not a preset calendar.
        </h3>
      </div>

      <div className="partner-construction__chart-stage">
        <EvilLineChart
          animationType="left-to-right"
          chartProps={{
            margin: { top: 24, right: 18, bottom: 10, left: 0 },
          }}
          className="partner-construction__evil-chart"
          config={drawRhythmConfig}
          curveType="monotoneX"
          data={drawRhythmData}
        >
          <Grid stroke="rgb(8 9 10 / 12%)" strokeDasharray="2 8" />
          <XAxis
            dataKey="phase"
            interval={0}
            tick={{ fontSize: 11, fontWeight: 700 }}
            tickMargin={12}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fontWeight: 700 }}
            tickFormatter={(value) => `${value}%`}
            width={42}
          />
          <Tooltip defaultIndex={3} roundness="sm" variant="frosted-glass" />
          <Line
            connectNulls
            dataKey="preset"
            lineProps={{ strokeWidth: 2.5 }}
            strokeVariant="dashed"
          >
            <Dot variant="default" />
            <ActiveDot variant="default" />
          </Line>
          <Line connectNulls dataKey="drawflow" glowing lineProps={{ strokeWidth: 3.5 }}>
            <Dot variant="colored-border" />
            <ActiveDot variant="colored-border" />
          </Line>
        </EvilLineChart>
      </div>

      <div className="partner-construction__chart-metrics" aria-label="Draw planning checkpoints">
        <div>
          <span>6</span>
          <p>milestone checkpoints</p>
        </div>
        <div>
          <span>3</span>
          <p>risk reviews before takeout</p>
        </div>
        <div>
          <span>1</span>
          <p>shared capital view</p>
        </div>
      </div>
    </div>
  )
}
