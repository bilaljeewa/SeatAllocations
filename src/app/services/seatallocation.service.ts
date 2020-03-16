import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

import { Programs, Sessions } from "../models/SeatAllocation";

@Injectable({
  providedIn: 'root'
})
export class SeatallocationService {
  live: boolean = false;
  baseUrl: string;
  token: string;

  constructor(private httpClient: HttpClient) {
    this.getContext();
  }

  private getContext() {
    var clientContextStr = (document.querySelector('#__ClientContext') as HTMLInputElement).value;
    var clientContext = JSON.parse(clientContextStr);
    this.token = (document.querySelector('#__RequestVerificationToken') as HTMLInputElement).value;
    this.baseUrl = clientContext.baseUrl;
  }

  // get programs for session
  public getPrograms(eventID): Observable<Programs[]> {
    if (this.live) return this.getLivePrograms(eventID);
    else return this.getFakedPrograms(eventID);
  }

  private getLivePrograms(eventID): Observable<Programs[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'RequestVerificationToken': this.token
      })
    }
    let url = this.baseUrl + 'api/Event?EventId=' + eventID;
    return this.httpClient.get(url, httpOptions)
      .pipe(map((res: any) => {
        return res.Items.$values[0].Functions.$values.map((x: any) =>
          (<Programs>
            {
              "EventFunctionId": x.EventFunctionId,
              "EventFunctionCode": x.EventFunctionCode,
              "Name": x.Name,
              "Description": x.Description
            }))
      }));
  }

  private getFakedPrograms(eventID): Observable<Programs[]> {
    let data = [{
      "EventFunctionId": "ANNCONF/BREAK",
      "EventFunctionCode": "BREAK",
      "Name": "Chairman's Breakfast",
      "Description": "Join us for a delicious breakfast and an opportunity for members to meet the Board of Directors face-to-face.Peter Bachman (chair), James Devon (vice-chair) and other leaders in the Board are eager to share the changes and developments that took place this year with you. This complimentary breakfast program provides members with the opportunity to learn about the Board’s vision for the coming year. Your Board of Directors is dedicated to the continued success of this industry, and are committed to being “the best leadership board.” This event is RSVP only due to limited seating. Please reserve your spot today!"
    },
    {
      "EventFunctionId": "ANNCONF/CITY",
      "EventFunctionCode": "CITY",
      "Name": "City Tour",
      "Description": "For families and friends, the City Tour will be a wonderful guided tour of the beautiful city of Cairns. Participants will take a walking tour of the central business district and shopping areas and stop for lunch. We will then visit St. Monica's Cathedral before taking a boat tour of the harbor. Cost of tour does not include price of lunch at the restaurant."
    },
    {
      "EventFunctionId": "ANNCONF/COMBSTRESS",
      "EventFunctionCode": "COMBSTRESS",
      "Name": "Best Practices",
      "Description": "Is there a standard of Best Practices for our industry? Join our keynote speaker in an exploration of the reference documents and other resources that could be used to propose a Best Practices Standard."
    },
    {
      "EventFunctionId": "ANNCONF/ECONTRENDS",
      "EventFunctionCode": "ECONTRENDS",
      "Name": "Economic Issues and Trends Forum",
      "Description": "Our Chief Economist brings you the very latest trends and forecasts which you can use to shape your business plan. The program will also include perspectives from other industry experts."
    },
    {
      "EventFunctionId": "ANNCONF/EXHIB30",
      "EventFunctionCode": "EXHIB30",
      "Name": "Exhibit Hall Hours - Day 1",
      "Description": "Check out the vendors and sponsors in the Exhibit Hall!"
    },
    {
      "EventFunctionId": "ANNCONF/EXHIBIT1",
      "EventFunctionCode": "EXHIBIT1",
      "Name": "Exhibit Hall Hours - Day 3",
      "Description": "Check out the vendors and sponsors in the Exhibit Hall!"
    },
    {
      "EventFunctionId": "ANNCONF/EXHIBIT2",
      "EventFunctionCode": "EXHIBIT2",
      "Name": "Exhibit Hall Hours Day 2",
      "Description": "Check out the vendors and sponsors in the Exhibit Hall!"
    },
    {
      "EventFunctionId": "ANNCONF/EXHIBIT31",
      "EventFunctionCode": "EXHIBIT31",
      "Name": "Exhibit Hall Hours",
      "Description": "Check out the vendors and sponsors in the Exhibit Hall!"
    },
    {
      "EventFunctionId": "ANNCONF/GALA",
      "EventFunctionCode": "GALA",
      "Name": "Gala Celebration",
      "Description": "This year's evening gala is a black-tie event in the grand ballroom. A sumptuous catered dinner featuring fresh seafood and an open bar will begin the evening, with blackjack, baccarat, and roulette provided by the casino. The John Chastain Jazz Band will provide entertainment for dancing and relaxing afterwards."
    },
    {
      "EventFunctionId": "ANNCONF/GLOBAL",
      "EventFunctionCode": "GLOBAL",
      "Name": "Global Alliances Luncheon",
      "Description": "A welcome session for international attendees and US attendees who are interested in improving your knowledge of international opportunities in your own market area! This session will be simultaneously translated into French, Mandarin Chinese, Portuguese and Spanish."
    },
    {
      "EventFunctionId": "ANNCONF/GUESTGOLF",
      "EventFunctionCode": "GUESTGOLF",
      "Name": "Golf Tournament",
      "Description": "Registration for the Golf Tournament, benefiting the Wildlife Conservation Society of Canada, is limited to four per conference attendee."
    },
    {
      "EventFunctionId": "ANNCONF/HOSP",
      "EventFunctionCode": "HOSP",
      "Name": "Hospitality Suite",
      "Description": "Join us in the Main Bar for a wonderful opportunity to meet and mingle with other conference attendees in Versaton's hospitality suite. Wine, beer, and specialty martinis will be on hand--limit two complimentary tickets per attendee."
    },
    {
      "EventFunctionId": "ANNCONF/INDUSTRY",
      "EventFunctionCode": "INDUSTRY",
      "Name": "State of the Industry",
      "Description": "This panel discussion will focus on the state of our industry and the challenges we face with the current economic conditions."
    },
    {
      "EventFunctionId": "ANNCONF/LEADER",
      "EventFunctionCode": "LEADER",
      "Name": "Leadership Patterns",
      "Description": "Based on three decades of leadership consultation to business organisations, clinical psychologist, our speaker will discuss her leadership research and experiences working with senior leaders."
    },
    {
      "EventFunctionId": "ANNCONF/LEGIS",
      "EventFunctionCode": "LEGIS",
      "Name": "Upcoming Legislation Report",
      "Description": "Join us for an overview of upcoming legislation that could impact our industry. Policy experts will share insights and perspectives to help us understand the importance of these issues."
    },
    {
      "EventFunctionId": "ANNCONF/LEGISLATION",
      "EventFunctionCode": "LEGISLATION",
      "Name": "Upcoming Legislation Report",
      "Description": "Join us for an overview of upcoming legislation that could impact our industry. Policy experts will share insights and perspectives to help us understand the importance of these issues."
    },
    {
      "EventFunctionId": "ANNCONF/MYTHMNG",
      "EventFunctionCode": "MYTHMNG",
      "Name": "Myths and Reality of Management",
      "Description": "Which of these myths of management are just that -- myths? Join a top executive in an exploration of stereotypes, mis-communication, and fabrications about what it's like to be a manager."
    },
    {
      "EventFunctionId": "ANNCONF/PERF",
      "EventFunctionCode": "PERF",
      "Name": "Why Performance Metrics Matter",
      "Description": "Strong performance metrics are vital to the operation of your business. This session will focus on developing useful and compelling performance metrics. Our panel of Executive Directors will offer useful tips from their experiences and will answer your questions."
    },
    {
      "EventFunctionId": "ANNCONF/PERSONNEL",
      "EventFunctionCode": "PERSONNEL",
      "Name": "Effective Personnel Management",
      "Description": "A discussion of the top ten tips in effective personnel management, and how to bring these best practices into your own workplace."
    },
    {
      "EventFunctionId": "ANNCONF/PLEN1",
      "EventFunctionCode": "PLEN1",
      "Name": "Plenary Session 1",
      "Description": "The first plenary session of the conference will feature Anne Broussard as our keynote speaker. Anne is the incoming president of the association and will speak about her plans for the upcoming year and her views on recent trends and issues within the industry. With over 30 years in the business, Anne is engaging, funny, and a wealth of knowledge that is not to be missed."
    },
    {
      "EventFunctionId": "ANNCONF/PLEN2",
      "EventFunctionCode": "PLEN2",
      "Name": "Plenary Session 2",
      "Description": "During our second plenary session we will have a panel of industry leaders and a roundtable discussion, with 30 minutes for audience questions at the end."
    },
    {
      "EventFunctionId": "ANNCONF/PLENARYSESSION",
      "EventFunctionCode": "PLENARYSESSION",
      "Name": "State of the Industry",
      "Description": "This panel discussion will focus on the state of our industry and the challenges we face with the current economic conditions."
    },
    {
      "EventFunctionId": "ANNCONF/STRESS",
      "EventFunctionCode": "STRESS",
      "Name": "Combating Stress On the Job",
      "Description": "This session will discuss theories on causes of stress in the workplace and how to better balance professional and personal time. We will discuss several fast, simple relaxation techniques that you can practice in the office and also cover some ergonomic tips to reduce physical stress on your body."
    },
    {
      "EventFunctionId": "ANNCONF/TECH",
      "EventFunctionCode": "TECH",
      "Name": "Technology Exhibit",
      "Description": "This state of the art technology exhibit will give attendees a chance to get a sneak preview at the latest advances in hardware and software for our industry, as well as speak with partners about ways to maximize branding potential. The technology exhibit will be held in a separate hall from the conference presentations, allowing attendees to come in and look around at their convenience. Over 50 exhibitors will be on hand!"
    },
    {
      "EventFunctionId": "ANNCONF/THUR-L",
      "EventFunctionCode": "THUR-L",
      "Name": "Tips for Industry Success",
      "Description": "Join us for a working lunch where we will discuss tips for improving success in the industry, along with an in-depth review of new certification requirements. Lunch will be catered by the Tamarind restaurant in the hotel."
    },
    {
      "EventFunctionId": "ANNCONF/TIPS",
      "EventFunctionCode": "TIPS",
      "Name": "Effective Personnel Management",
      "Description": "A discussion of the top ten tips in effective personnel management, and how to bring these best practices into your own workplace. Bring all your unanswered questions--there will be ample time for open Q and A during this session."
    },
    {
      "EventFunctionId": "ANNCONF/TIPS2",
      "EventFunctionCode": "TIPS2",
      "Name": "Tips for Industry Success Part 2",
      "Description": "Join us for the second session of this popular topic. This is one of our most-attended sessions every year, and is a wonderful opportunity for informal networking and finding a mentor in the industry."
    }]
    return of(data).pipe(delay(500));
  }

  // get sessions
  public getSessions(eventID): Observable<Sessions[]> {
    if (this.live) return this.getLiveSessions(eventID);
    else return this.getFakedSessions(eventID);
  }

  private getLiveSessions(eventID): Observable<Sessions[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'RequestVerificationToken': this.token
      })
    }
    let url = this.baseUrl + 'api/Psc_Event_Session?EventID' + eventID;
    return this.httpClient.get(url, httpOptions)
      .pipe(map((res: any) => {
        return res.Items.$values
      }));
  }

  private getFakedSessions(eventID): Observable<Sessions[]> {
    let data = [
      {
        "$type": "Asi.Soa.Core.DataContracts.GenericEntityData, Asi.Contracts",
        "EntityTypeName": "Psc_Event_Session",
        "PrimaryParentEntityTypeName": "Standalone",
        "Identity": {
          "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
          "EntityTypeName": "Psc_Event_Session",
          "IdentityElements": {
            "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
            "$values": [
              "9"
            ]
          }
        },
        "PrimaryParentIdentity": {
          "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
          "EntityTypeName": "Standalone",
          "IdentityElements": {
            "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
            "$values": [
              "9"
            ]
          }
        },
        "Properties": {
          "$type": "Asi.Soa.Core.DataContracts.GenericPropertyDataCollection, Asi.Contracts",
          "$values": [
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "Ordinal",
              "Value": {
                "$type": "System.Int32",
                "$value": 9
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalUnallocated",
              "Value": {
                "$type": "System.Int32",
                "$value": 0
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalAllocated",
              "Value": {
                "$type": "System.Int32",
                "$value": 0
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalSeats",
              "Value": {
                "$type": "System.Int32",
                "$value": 0
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalTables",
              "Value": {
                "$type": "System.Int32",
                "$value": 0
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "Programs",
              "Value": "ANNCONF/TIPS,ANNCONF/STRESS"
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "SessionName",
              "Value": "Delegate Reception 2"
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "EventID",
              "Value": "LDC11"
            }
          ]
        }
      },
      {
        "$type": "Asi.Soa.Core.DataContracts.GenericEntityData, Asi.Contracts",
        "EntityTypeName": "Psc_Event_Session",
        "PrimaryParentEntityTypeName": "Standalone",
        "Identity": {
          "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
          "EntityTypeName": "Psc_Event_Session",
          "IdentityElements": {
            "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
            "$values": [
              "10"
            ]
          }
        },
        "PrimaryParentIdentity": {
          "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
          "EntityTypeName": "Standalone",
          "IdentityElements": {
            "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
            "$values": [
              "10"
            ]
          }
        },
        "Properties": {
          "$type": "Asi.Soa.Core.DataContracts.GenericPropertyDataCollection, Asi.Contracts",
          "$values": [
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "Ordinal",
              "Value": {
                "$type": "System.Int32",
                "$value": 10
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalUnallocated",
              "Value": {
                "$type": "System.Int32",
                "$value": 0
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalAllocated",
              "Value": {
                "$type": "System.Int32",
                "$value": 0
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalSeats",
              "Value": {
                "$type": "System.Int32",
                "$value": 0
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "TotalTables",
              "Value": {
                "$type": "System.Int32",
                "$value": 0
              }
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "Programs",
              "Value": "ANNCONF/LEGIS, ANNCONF/GUESTGOLF"
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "SessionName",
              "Value": "Delegate Reception 5"
            },
            {
              "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
              "Name": "EventID",
              "Value": "LDC11"
            }
          ]
        }
      }
    ]
    return of(data).pipe(delay(500));
  }

  // add session
  public addSession(data): Observable<Sessions> {
    if (this.live) return this.addLiveSession(data);
    else return this.addFakedSession(data);
  }

  private addLiveSession(data): Observable<Sessions> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'RequestVerificationToken': this.token
      })
    }
    let postSessionData = {
      "$type": "Asi.Soa.Core.DataContracts.GenericEntityData, Asi.Contracts",
      "EntityTypeName": "Psc_Event_Session",
      "PrimaryParentEntityTypeName": "Standalone",
      "Identity": {
        "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
        "EntityTypeName": "Psc_Event_Session",
        "IdentityElements": {
          "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
          "$values": [""]
        }
      },
      "PrimaryParentIdentity": {
        "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
        "EntityTypeName": "Standalone",
        "IdentityElements": {
          "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
          "$values": [""]
        }
      },
      "Properties": {
        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyDataCollection, Asi.Contracts",
        "$values": data.session
      }
    }
    let url = this.baseUrl + 'api/Psc_Event_Session';
    return this.httpClient.post(url, postSessionData, httpOptions).pipe(map((res: Sessions) => { return res; }));
  }

  private addFakedSession(data): Observable<Sessions> {
    let data1: Sessions = {
      "$type": "Asi.Soa.Core.DataContracts.GenericEntityData, Asi.Contracts",
      "EntityTypeName": "Psc_Event_Session",
      "PrimaryParentEntityTypeName": "Standalone",
      "Identity": {
        "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
        "EntityTypeName": "Psc_Event_Session",
        "IdentityElements": {
          "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
          "$values": [
            "0"
          ]
        }
      },
      "PrimaryParentIdentity": {
        "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
        "EntityTypeName": "Standalone",
        "IdentityElements": {
          "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
          "$values": [
            "0"
          ]
        }
      },
      "Properties": {
        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyDataCollection, Asi.Contracts",
        "$values": [
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "Ordinal",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "TotalUnallocated",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "TotalAllocated",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "TotalSeats",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "TotalTables",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "Programs",
            "Value": "WELCOME, Guests"
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "SessionName",
            "Value": "Delegate Reception 5"
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "EventID",
            "Value": "LDC11"
          }
        ]
      }
    }
    return of(data1).pipe(delay(500));
  }

  // update session
  public updateSession(data): Observable<Sessions> {
    if (this.live) return this.updateLiveSession(data);
    else return this.updateFakedSession(data);
  }

  private updateLiveSession(data): Observable<Sessions> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'RequestVerificationToken': this.token
      })
    }
    let postSessionData = {
      "$type": "Asi.Soa.Core.DataContracts.GenericEntityData, Asi.Contracts",
      "EntityTypeName": "Psc_Event_Session",
      "PrimaryParentEntityTypeName": "Standalone",
      "Identity": {
        "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
        "EntityTypeName": "Psc_Event_Session",
        "IdentityElements": {
          "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
          "$values": [data.sessionID]
        }
      },
      "PrimaryParentIdentity": {
        "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
        "EntityTypeName": "Standalone",
        "IdentityElements": {
          "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
          "$values": [data.sessionID]
        }
      },
      "Properties": {
        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyDataCollection, Asi.Contracts",
        "$values": data.session
      }
    }
    let url = this.baseUrl + 'api/Psc_Event_Session/' + data.sessionID;
    return this.httpClient.put(url, postSessionData, httpOptions).pipe(map((res: Sessions) => { return res; }));
  }

  private updateFakedSession(data): Observable<Sessions> {
    let data1: Sessions = {
      "$type": "Asi.Soa.Core.DataContracts.GenericEntityData, Asi.Contracts",
      "EntityTypeName": "Psc_Event_Session",
      "PrimaryParentEntityTypeName": "Standalone",
      "Identity": {
        "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
        "EntityTypeName": "Psc_Event_Session",
        "IdentityElements": {
          "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
          "$values": [
            "10"
          ]
        }
      },
      "PrimaryParentIdentity": {
        "$type": "Asi.Soa.Core.DataContracts.IdentityData, Asi.Contracts",
        "EntityTypeName": "Standalone",
        "IdentityElements": {
          "$type": "System.Collections.ObjectModel.Collection`1[[System.String, mscorlib]], mscorlib",
          "$values": [
            "10"
          ]
        }
      },
      "Properties": {
        "$type": "Asi.Soa.Core.DataContracts.GenericPropertyDataCollection, Asi.Contracts",
        "$values": [
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "Ordinal",
            "Value": {
              "$type": "System.Int32",
              "$value": 10
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "TotalUnallocated",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "TotalAllocated",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "TotalSeats",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "TotalTables",
            "Value": {
              "$type": "System.Int32",
              "$value": 0
            }
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "Programs",
            "Value": "ANNCONF/LEGIS, ANNCONF/GUESTGOLF"
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "SessionName",
            "Value": "Delegate Reception 5"
          },
          {
            "$type": "Asi.Soa.Core.DataContracts.GenericPropertyData, Asi.Contracts",
            "Name": "EventID",
            "Value": "LDC11"
          }
        ]
      }
    }
    return of(data1).pipe(delay(500));
  }

  // delete session
  public deleteSession(sessionID): Observable<any> {
    if (this.live) return this.deleteLiveSession(sessionID);
    else return this.deleteFakedSession(sessionID);
  }

  private deleteLiveSession(sessionID): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'RequestVerificationToken': this.token
      })
    }
    let url = this.baseUrl + 'api/Psc_Event_Session/' + sessionID;
    return this.httpClient.delete(url, httpOptions).pipe(map((res: any) => { return res; }));
  }

  private deleteFakedSession(sessionID): Observable<any> {
    return of("").pipe(delay(500));
  }
}
