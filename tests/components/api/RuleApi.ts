import { ApiBase, atc } from '@dts/test-kit';

export interface PrerequisiteRulePayload {
  target_course_id: string
  condition: 'ALL' | 'ANY'
  source_course_ids: string[]
  parent_rule_id?: string
}

export interface PrerequisiteRule {
  id: string
  target_course_id: string
  condition: 'ALL' | 'ANY'
  is_active: boolean
  parent_rule_id: string | null
  created_at: string
}

export interface OverridePayload {
  student_id: string
  rule_id: string
  reason: string
  expires_at?: string
}

export interface ManualOverride {
  id: string
  student_id: string
  rule_id: string
  reason: string
  status: string
  expires_at: string | null
  created_at: string
}

export class RuleApi extends ApiBase {
  @atc('DTS-RULE-1', { story: 'DTS-3', feature: 'Rule Engine' })
  async createPrerequisiteRule(
    payload: PrerequisiteRulePayload,
  ): Promise<[Response, PrerequisiteRule, PrerequisiteRulePayload]> {
    return this.post<PrerequisiteRule, PrerequisiteRulePayload>(
      '/admin/rules',
      payload,
    );
  }

  @atc('DTS-RULE-1', { story: 'DTS-3', feature: 'Rule Engine' })
  async listRulesByTrack(trackId: string): Promise<[Response, PrerequisiteRule[]]> {
    return this.get<PrerequisiteRule[]>(`/rules?trackId=${trackId}`);
  }

  @atc('DTS-RULE-2', { story: 'DTS-3', feature: 'Rule Engine' })
  async evaluateEligibility(
    studentId: string,
    trackId: string,
  ): Promise<[Response, { eligible: boolean, breakdown: unknown }, { studentId: string, trackId: string }]> {
    return this.post<{ eligible: boolean, breakdown: unknown }, { studentId: string, trackId: string }>(
      '/rules/evaluate',
      { studentId, trackId },
    );
  }

  @atc('DTS-RULE-3', { story: 'DTS-3', feature: 'Rule Engine' })
  async createOverride(
    payload: OverridePayload,
  ): Promise<[Response, ManualOverride, OverridePayload]> {
    return this.post<ManualOverride, OverridePayload>(
      '/admin/overrides',
      payload,
    );
  }

  @atc('DTS-RULE-3', { story: 'DTS-3', feature: 'Rule Engine' })
  async revokeOverride(
    overrideId: string,
  ): Promise<[Response, ManualOverride]> {
    return this.del<ManualOverride>(`/admin/overrides/${overrideId}`);
  }
}
