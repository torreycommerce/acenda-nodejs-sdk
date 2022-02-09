import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
export interface AcendaErrorResponse {
  code: number
  status: string
  error: string
}

export class AcendaError implements AxiosError {
  constructor(public config: AxiosRequestConfig, public error: AxiosError) {
    this.code = error.code ? error.code : error.response?.status.toString()
    this.name = error.name
    this.message = error.message ? error.message : error.response?.data.error
    this.isAxiosError = error.isAxiosError
    this.response = error.response
    this.request = error.request

  }
  code?: string | undefined;
  request?: any;
  response?: AxiosResponse<any> | undefined;
  isAxiosError: boolean;
  name: string;
  message: string;
  stack?: string | undefined;
  toJSON(): object {
    return this.toJSON();
  }
}

export class Acenda {
  apiRate: number
  constructor(private store: string, private accessToken: string, private retryOnFail: boolean = true) {
    this.apiRate = 0
  }

  private async wait(seconds: number) {
    return new Promise((r, j) => setTimeout(r, 1000 * seconds))
  }
  private retryAttempt = 0
  public async create(endPoint: string, data: any): Promise<AxiosResponse> {
    const url = this.urlBuilder(endPoint)
    try {
      if (this.apiRate > 70) {
        await this.wait(3);
      }
      const response = await axios.post(url, data)
      await this.handleThrottling(response);
      this.retryAttempt = 0
      return response
    } catch (error: any) {
      if (!error.response) {
        this.retryAttempt++
        await this.wait(30 * this.retryAttempt)
        if (this.retryAttempt < 3) {
          return await this.create(endPoint, data)
        } else if (error.isAxiosError) {
          throw new AcendaError({ url }, error);
        } else {
          throw error
        }
      } else if (error.response.status != 400 && this.retryAttempt < 3) {
        this.retryAttempt++
        return await this.create(endPoint, data)
      } else {
        throw error
      }
    }
  }

  private async handleThrottling(response: AxiosResponse<any>) {
    const rateLimit: string = response.headers["x-acenda-api-throttle-call-limit"];
    if (rateLimit) {
      const rate = Number(rateLimit.substring(0, rateLimit.indexOf('/')).trim());
      if (Number.isInteger(rate)) {
        this.apiRate = rate
        if (rate >= 80) {
          await this.wait(3);
        }
      }
    }

  }

  public async update(endPoint: string, id: string, data: any): Promise<AxiosResponse> {
    const url = this.urlBuilder(`${endPoint}/${id}`)
    try {
      if (this.apiRate > 70) {
        await this.wait(3);
      }
      const response = await axios.put(url, data)
      await this.handleThrottling(response);
      this.retryAttempt = 0
      return response
    } catch (error: any) {
      if (!error.response) {
        this.retryAttempt++
        await this.wait(30 * this.retryAttempt)
        if (this.retryAttempt < 3) {
          return await this.update(endPoint, id, data)
        } else if (error.isAxiosError) {
          throw new AcendaError({ url }, error);
        } else {
          throw error
        }
      } else if (error.response.status != 400 && this.retryAttempt < 3) {
        this.retryAttempt++
        return await this.update(endPoint, id, data)
      } else {
        throw error
      }
    }
  }

  public async delete(endPoint: string, id: string): Promise<AxiosResponse> {
    const url = this.urlBuilder(`${endPoint}/${id}`)

    try {
      if (this.apiRate > 70) {
        await this.wait(3);
      }
      const response = await axios.delete(url, { timeout: 60000 })
      await this.handleThrottling(response);
      this.retryAttempt = 0
      return response
    } catch (error: any) {
      if (!error.response) {
        this.retryAttempt++
        await this.wait(30 * this.retryAttempt)
        if (this.retryAttempt < 3) {
          return await this.delete(endPoint, id)
        } else if (error.isAxiosError) {
          throw new AcendaError({ url }, error);
        } else {
          throw error
        }
      } else if (error.response.status != 400 && this.retryAttempt < 3) {
        this.retryAttempt++
        return await this.delete(endPoint, id)
      } else {
        throw error
      }
    }
  }

  public async list(endPoint: string, params?: string, page?: number, limit?: number): Promise<AxiosResponse> {
    const url = this.urlBuilder(endPoint, params, page, limit)
    try {
      if (this.apiRate > 70) {
        await this.wait(3);
      }
      const response = await axios.get(url, { timeout: 60000 })
      await this.handleThrottling(response);
      this.retryAttempt = 0
      return response
    } catch (error: any) {
      if (!error.response) {
        this.retryAttempt++
        await this.wait(30 * this.retryAttempt)
        if (this.retryAttempt < 3) {
          return await this.list(endPoint, params, page, limit)
        } else if (error.isAxiosError) {
          throw new AcendaError({ url }, error);
        } else {
          throw error
        }
      } else if (error.response.status != 400 && this.retryAttempt < 3) {
        this.retryAttempt++
        return await this.list(endPoint, params, page, limit)
      } else {
        throw error
      }
    }
  }

  public async get(endPoint: string, id: string): Promise<AxiosResponse> {
    const url = this.urlBuilder(`${endPoint}/${id}`)
    try {
      if (this.apiRate > 70) {
        await this.wait(3);
      }
      const response = await axios.get(url)
      await this.handleThrottling(response);
      this.retryAttempt = 0
      return response
    } catch (error: any) {
      if (!error.response) {
        this.retryAttempt++
        await this.wait(30 * this.retryAttempt)
        if (this.retryAttempt < 3) {
          return await this.get(endPoint, id)
        } else if (error.isAxiosError) {
          throw new AcendaError({ url }, error);
        } else {
          throw error
        }
      } else if (error.response.status != 400 && this.retryAttempt < 3) {
        this.retryAttempt++
        return await this.get(endPoint, id)
      } else {
        throw error
      }
    }
  }

  private urlBuilder(endPoint: string, params?: string, page?: number, limit?: number): string {
    try {
      if (params) {
        params = encodeURIComponent(params)
        let regexEqual = new RegExp('%3D', 'g');
        let regexSemicolumn = new RegExp('%3A', 'g');
        let regexDollar = new RegExp('%24', 'g');
        let regexLeftCurlyBracket = new RegExp('%7B', 'g');
        let regexRightCurlyBracket = new RegExp('%7D', 'g');
        params = params.replace(regexEqual, '=').replace(regexSemicolumn, ':').replace(regexDollar, '$').replace(regexLeftCurlyBracket, '{').replace(regexRightCurlyBracket, '}')
      }
      if (params) {
        params = '&' + params
      } else {
        params = ""
      }
      if (page && limit) {
        params = `${params}&page=${page}&limit=${limit}`
      }
      return `https://${this.store}.acenda.com/api/${endPoint}?access_token=${this.accessToken}${params}`
    } catch (error) {
      throw error
    }
  }
}

