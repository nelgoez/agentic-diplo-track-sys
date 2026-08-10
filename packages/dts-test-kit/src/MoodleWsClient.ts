export interface MoodleWsConfig {
  baseUrl: string
  token: string
}

export interface MoodleCompletionStatus {
  cmid: number
  modname: string
  instance: number
  state: number
  timecompleted: number
  tracking: number
  overrideby: number | null
  valueused: boolean
  hascompletion: boolean
  isautomatic: boolean
  istrackeduser: boolean
  uservisible: boolean
  details: Array<{
    rulename: string
    rulevalue: { status: number, description: string }
  }>
}

export interface MoodleCourseUser {
  id: number
  username: string
  firstname: string
  lastname: string
  fullname: string
  email: string
  department: string
  firstaccess: number
  lastaccess: number
  auth: string
  confirmed: boolean
  idnumber: string
}

export interface MoodleSiteInfo {
  sitename: string
  username: string
  firstname: string
  lastname: string
  fullname: string
  lang: string
  userid: number
  siteurl: string
  userpictureurl: string
  functions: Array<{ name: string, version: string }>
  release: string
  version: string
}

export interface MoodleException {
  exception: string
  errorcode: string
  message: string
}

export class MoodleWsClient {
  private baseUrl: string;
  private token: string;

  constructor(config: MoodleWsConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.token = config.token;
  }

  async call<T>(wsfunction: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/webservice/rest/server.php`);
    url.searchParams.set('wstoken', this.token);
    url.searchParams.set('wsfunction', wsfunction);
    url.searchParams.set('moodlewsrestformat', 'json');

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) { continue; }
      if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          if (typeof item === 'object' && item !== null) {
            for (const [subKey, subVal] of Object.entries(item as Record<string, unknown>)) {
              url.searchParams.set(`${key}[${idx}][${subKey}]`, String(subVal));
            }
          }
          else {
            url.searchParams.set(`${key}[${idx}]`, String(item));
          }
        });
      }
      else if (typeof value === 'object') {
        for (const [subKey, subVal] of Object.entries(value as Record<string, unknown>)) {
          url.searchParams.set(`${key}[${subKey}]`, String(subVal));
        }
      }
      else {
        url.searchParams.set(key, String(value));
      }
    }

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      throw new Error(`Moodle WS HTTP ${resp.status}: ${resp.statusText}`);
    }
    const data = await resp.json() as Record<string, unknown>;
    if (data.exception) {
      throw Object.assign(new Error(`Moodle WS ${String(data.errorcode)}: ${String(data.message)}`), {
        errorcode: data.errorcode as string,
        message: data.message as string,
      });
    }
    return data as T;
  }

  async getSiteInfo(): Promise<MoodleSiteInfo> {
    return this.call<MoodleSiteInfo>('core_webservice_get_site_info');
  }

  async getUsersByField(field: 'id' | 'email' | 'username', values: string[]): Promise<MoodleCourseUser[]> {
    return this.call<MoodleCourseUser[]>('core_user_get_users_by_field', { field, values });
  }

  async getActivitiesCompletionStatus(courseId: number, userId: number): Promise<{
    statuses: MoodleCompletionStatus[]
    warnings?: unknown[]
  }> {
    return this.call('core_completion_get_activities_completion_status', {
      courseid: courseId,
      userid: userId,
    });
  }

  async getCourseContents(courseId: number): Promise<unknown[]> {
    return this.call('core_course_get_contents', { courseid: courseId });
  }
}

export class MoodleMockFactory {
  static siteInfo(overrides?: Partial<MoodleSiteInfo>): MoodleSiteInfo {
    return {
      sitename: 'UNC Campus Virtual',
      username: 'wsuser',
      firstname: 'Web',
      lastname: 'Service',
      fullname: 'Web Service',
      lang: 'es',
      userid: 2,
      siteurl: 'https://campus.aulavirtual.unc.edu.ar',
      userpictureurl: '',
      functions: [],
      release: '4.1.0',
      version: '20230116',
      ...overrides,
    };
  }

  static completionStatus(overrides?: Partial<MoodleCompletionStatus>): MoodleCompletionStatus {
    return {
      cmid: 1,
      modname: 'assign',
      instance: 1,
      state: 1,
      timecompleted: Math.floor(Date.now() / 1000),
      tracking: 2,
      overrideby: null,
      valueused: true,
      hascompletion: true,
      isautomatic: false,
      istrackeduser: true,
      uservisible: true,
      details: [],
      ...overrides,
    };
  }

  static courseUser(overrides?: Partial<MoodleCourseUser>): MoodleCourseUser {
    return {
      id: 1,
      username: 'student1',
      firstname: 'Test',
      lastname: 'Student',
      fullname: 'Test Student',
      email: 'student@dts.unc.edu.ar',
      department: '',
      firstaccess: 0,
      lastaccess: 0,
      auth: 'manual',
      confirmed: true,
      idnumber: '',
      ...overrides,
    };
  }
}
