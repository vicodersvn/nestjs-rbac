export interface ICacheRBAC {
  key: string;
  ttl: number;

  get(): { [key: string]: any } | null;

  /**
   *
   * @param value
   */
  set(value: { [key: string]: any }): void;

  del(): void;
}
