/* SIMULATOR DATA & STATE */
    const flows = {
      b2b: {
        botName: "LeadOS AI RevOps",
        avatar: "OS",
        initialLogs: [
          { time: "00:01", tag: "meta", text: "Webhook: Inbound lead captured from LinkedIn Ad #B2B-RevOps" },
          { time: "00:02", tag: "crm", text: "HubSpot: Contact created for prospect (Status: New)" }
        ],
        steps: [
          {
            bot: "Hey Sarah! 👋 Thanks for requesting our WhatsApp RevOps blueprint. Quick question: How many inbound leads does your sales team process each month?",
            buttons: ["Under 500 leads/mo", "500 - 2,500 leads/mo", "2,500+ leads/mo"],
            nextOnSelect: 1
          },
          {
            bot: "Awesome! At 500 - 2,500 leads/mo, our automated AI SDR cuts lead drop-off by 62% and saves roughly 35 hours per sales rep weekly. Would you like me to book a 15-min technical demo with our lead architect?",
            buttons: ["📅 Yes, book demo on calendar", "📊 Send full case study first"],
            nextOnSelect: 2
          },
          {
            bot: "Perfect! 🗓️ I have an opening tomorrow at 10:30 AM or 3:00 PM EST. Which time slot suits you better?",
            buttons: ["Tomorrow 10:30 AM EST", "Tomorrow 3:00 PM EST"],
            nextOnSelect: 3
          },
          {
            bot: "Confirmed! 🎉 Your demo is locked for tomorrow. Calendar invite and preparation notes have been dispatched to your email and WhatsApp!",
            buttons: ["↺ Test Another Scenario"],
            nextOnSelect: "reset"
          }
        ],
        logResponses: [
          { tag: "ai", text: "Intent classified: Qualified SaaS Buyer (Score: 92/100)" },
          { tag: "crm", text: "HubSpot Deal Stage changed -> 'Demo Requested'" },
          { tag: "crm", text: "Google Calendar API: Confirmed invite dispatched. Slack alert pushed to #enterprise-deals." }
        ]
      },
      ecom: {
        botName: "LuxeFit Concierge",
        avatar: "LX",
        initialLogs: [
          { time: "00:01", tag: "meta", text: "Shopify Webhook: Cart abandoned ($184.00, 2 items)" },
          { time: "00:02", tag: "ai", text: "Triggered 15-min WhatsApp Cart Recovery Flow" }
        ],
        steps: [
          {
            bot: "Hey Jordan! 🎒 You left the Classic Merino Pullover in your cart. It's currently in high demand with only 3 units left in your size. Would you like a 10% instant voucher to complete your order?",
            buttons: ["Claim 10% Off & Checkout", "Ask size & fit question", "I'll pass for now"],
            nextOnSelect: 1
          },
          {
            bot: "Here is your exclusive voucher code: LUXE10 🎁 Your cart total has been updated to $165.60. Click below to securely check out in 1 tap:",
            buttons: ["💳 1-Click WhatsApp Checkout ($165.60)", "Ask about return policy"],
            nextOnSelect: 2
          },
          {
            bot: "Payment verified via Stripe! 🚀 Your order #LX-8492 is confirmed and will ship via Express tomorrow morning. Tracking updates will arrive right here on WhatsApp!",
            buttons: ["↺ Test Another Scenario"],
            nextOnSelect: "reset"
          }
        ],
        logResponses: [
          { tag: "crm", text: "Shopify API: Applied discount code LUXE10 to Cart #9410" },
          { tag: "crm", text: "Stripe Webhook: Charge succeeded ($165.60). Order converted!" }
        ]
      },
      estate: {
        botName: "Apex Luxury Living",
        avatar: "AX",
        initialLogs: [
          { time: "00:01", tag: "meta", text: "Click-to-WhatsApp Ad: 'Skyline Penthouse Collection' (Meta Ad #RE-44)" },
          { time: "00:02", tag: "crm", text: "Salesforce: Inbound High-Net-Worth Lead Created" }
        ],
        steps: [
          {
            bot: "Welcome to Apex Skyline Living. 🏙️ Are you interested in 2-Bedroom City Views or our 4-Bedroom Duplex Penthouses?",
            buttons: ["2-Bedroom City Views", "4-Bedroom Duplex Penthouses"],
            nextOnSelect: 1
          },
          {
            bot: "The Skyline Penthouses feature private infinity pools and 360° panoramic terraces. I've prepared a digital brochure & floor plan. Would you like me to send the PDF and schedule a VIP private viewing?",
            buttons: ["📥 Download Brochure PDF", "📅 Schedule VIP Site Tour"],
            nextOnSelect: 2
          },
          {
            bot: "Brochure sent! 📑 Our Managing Partner Mr. Reynolds has reserved Saturday at 11:00 AM for your private champagne tour. Valet parking code: APEX-VIP.",
            buttons: ["↺ Test Another Scenario"],
            nextOnSelect: "reset"
          }
        ],
        logResponses: [
          { tag: "crm", text: "Lead Enriched: Budget qualified at $3.2M+. Salesforce tier: VIP" },
          { tag: "alert", text: "VIP Broker Alert: Dispatched SMS to Senior Realtor" }
        ]
      },
      clinic: {
        botName: "Elevate Health Clinic",
        avatar: "EH",
        initialLogs: [
          { time: "00:01", tag: "meta", text: "Website QR Code scanned -> WhatsApp Assistant opened" },
          { time: "00:02", tag: "crm", text: "EHR Pipeline: Patient Intake Initialized" }
        ],
        steps: [
          {
            bot: "Hello! Welcome to Elevate Health. How can we care for you today?",
            buttons: ["Schedule Specialist Visit", "Prescription Refill", "Speak to Care Team"],
            nextOnSelect: 1
          },
          {
            bot: "We have immediate consultation slots available for Dermatology, Cardiology, and General Wellness. Which department do you need?",
            buttons: ["Dermatology", "General Wellness", "Cardiology"],
            nextOnSelect: 2
          },
          {
            bot: "Dr. Chen has an opening this Thursday at 2:15 PM. Your appointment is tentatively reserved. Please confirm your time:",
            buttons: ["Confirm Thursday 2:15 PM", "Request alternate time"],
            nextOnSelect: 3
          },
          {
            bot: "Appointment Confirmed! 🩺 We've synced your calendar and sent your pre-visit intake checklist. See you Thursday!",
            buttons: ["↺ Test Another Scenario"],
            nextOnSelect: "reset"
          }
        ],
        logResponses: [
          { tag: "crm", text: "EHR Sync: Intake form assigned to Dr. Chen schedule" },
          { tag: "ai", text: "Automated SMS/WhatsApp reminder queue set for T-24h and T-2h" }
        ]
      }
    };

    let currentFlowKey = 'b2b';
    let currentStepIndex = 0;
    let logCounter = 3;

    function switchSimFlow(flowKey, btnElement) {
      currentFlowKey = flowKey;
      currentStepIndex = 0;
      
      // Update Tab UI
      document.querySelectorAll('.sim-tab-btn').forEach(btn => btn.classList.remove('active'));
      if(btnElement) btnElement.classList.add('active');

      const flow = flows[flowKey];
      document.getElementById('simBotName').innerHTML = flow.botName + ' <svg class="wa-verified-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
      document.getElementById('simAvatar').innerText = flow.avatar;

      // Reset messages
      const msgScroll = document.getElementById('simMessagesScroll');
      msgScroll.innerHTML = '';

      // Reset logs
      const logFeed = document.getElementById('liveFeedLogs');
      logFeed.innerHTML = '';
      flow.initialLogs.forEach(l => {
        addLog(l.tag, l.text);
      });

      // Render step 0
      renderStep(0);
    }

    function renderStep(stepIdx) {
      const flow = flows[currentFlowKey];
      const step = flow.steps[stepIdx];
      if(!step) return;

      showTyping(true);
      setTimeout(() => {
        showTyping(false);
        addBotMessage(step.bot, step.buttons);
      }, 600);
    }

    function addBotMessage(text, buttons) {
      const msgScroll = document.getElementById('simMessagesScroll');
      const time = getCurrentTime();

      let buttonsHtml = '';
      if(buttons && buttons.length > 0) {
        buttonsHtml = '<div class="wa-quick-actions">';
        buttons.forEach(btnText => {
          buttonsHtml += `<div class="wa-action-btn" onclick="handleButtonClick('${btnText.replace(/'/g, "\'")}')">${btnText}</div>`;
        });
        buttonsHtml += '</div>';
      }

      const bubble = document.createElement('div');
      bubble.className = 'wa-bubble wa-bubble-bot';
      bubble.innerHTML = `${text}${buttonsHtml}<div class="wa-bubble-time">${time}</div>`;
      msgScroll.appendChild(bubble);
      msgScroll.scrollTop = msgScroll.scrollHeight;
    }

    function addUserMessage(text) {
      const msgScroll = document.getElementById('simMessagesScroll');
      const time = getCurrentTime();

      const bubble = document.createElement('div');
      bubble.className = 'wa-bubble wa-bubble-user';
      bubble.innerHTML = `${text}<div class="wa-bubble-time">${time} <span class="wa-double-check">✓✓</span></div>`;
      msgScroll.appendChild(bubble);
      msgScroll.scrollTop = msgScroll.scrollHeight;
    }

    function handleButtonClick(btnText) {
      if(btnText.includes('Test Another Scenario')) {
        resetCurrentFlow();
        return;
      }
      addUserMessage(btnText);
      advanceStep();
    }

    function advanceStep() {
      const flow = flows[currentFlowKey];
      
      // Trigger corresponding backend log
      if(flow.logResponses && flow.logResponses[currentStepIndex]) {
        const respLog = flow.logResponses[currentStepIndex];
        addLog(respLog.tag, respLog.text);
      }

      currentStepIndex++;
      if(currentStepIndex < flow.steps.length) {
        renderStep(currentStepIndex);
      } else {
        // Reset or finish
        setTimeout(() => {
          addBotMessage("Would you like to test another scenario or book a consultation?", ["↺ Test Another Scenario", "📅 Schedule Strategy Call"]);
        }, 800);
      }
    }

    function sendSimUserMessage() {
      const input = document.getElementById('simUserInput');
      const val = input.value.trim();
      if(!val) return;
      addUserMessage(val);
      input.value = '';
      advanceStep();
    }

    function handleSimEnter(e) {
      if(e.key === 'Enter') {
        sendSimUserMessage();
      }
    }

    function showTyping(show) {
      const t = document.getElementById('simTyping');
      t.style.display = show ? 'inline-flex' : 'none';
      const msgScroll = document.getElementById('simMessagesScroll');
      msgScroll.scrollTop = msgScroll.scrollHeight;
    }

    function addLog(tag, text) {
      const logFeed = document.getElementById('liveFeedLogs');
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `
        <span class="log-time">[${timeStr}]</span>
        <span class="log-tag tag-${tag}">${tag}</span>
        <span class="log-desc">${text}</span>
      `;
      logFeed.appendChild(div);
      logFeed.scrollTop = logFeed.scrollHeight;
    }

    function resetCurrentFlow() {
      switchSimFlow(currentFlowKey, document.querySelector(`.sim-tab-btn.active`));
    }

    function getCurrentTime() {
      const d = new Date();
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /* ROI CALCULATOR LOGIC */
    function updateCalculator() {
      const leads = parseInt(document.getElementById('inputLeads').value);
      const aov = parseFloat(document.getElementById('inputAOV').value);
      const currentCR = parseFloat(document.getElementById('inputCR').value);
      const adoption = parseFloat(document.getElementById('inputAdoption').value) / 100.0;

      // Update Slider Label Displays
      document.getElementById('dispLeads').innerText = leads.toLocaleString();
      document.getElementById('dispAOV').innerText = '$' + aov.toLocaleString();
      document.getElementById('dispCR').innerText = currentCR.toFixed(1) + '%';
      document.getElementById('dispAdoption').innerText = Math.round(adoption * 100) + '%';

      // Calculations:
      // WhatsApp leads engaged
      const waLeads = leads * adoption;
      // Traditional conversions from those leads
      const tradConversions = waLeads * (currentCR / 100.0);
      // WhatsApp conversion lift factor: 3.2x higher than email/form
      const waCR = Math.min((currentCR * 3.2), 35.0); // capped reasonably
      const waConversions = waLeads * (waCR / 100.0);
      
      const additionalDeals = Math.max(0, Math.round(waConversions - tradConversions));
      const monthlyAddedRev = Math.round(additionalDeals * aov);
      const annualAddedRev = monthlyAddedRev * 12;
      const hoursSaved = Math.round(waLeads * 0.12);

      // Render Outputs
      document.getElementById('resMonthlyRev').innerText = '$' + monthlyAddedRev.toLocaleString();
      document.getElementById('resAnnualRev').innerText = '+$' + annualAddedRev.toLocaleString() + ' Annualized Pipeline Expansion';
      document.getElementById('resDeals').innerText = '+' + additionalDeals.toLocaleString() + ' / mo';
      document.getElementById('resLeadsEngaged').innerText = Math.round(waLeads).toLocaleString() + ' leads engaged in < 3 seconds';
      document.getElementById('resHours').innerText = hoursSaved.toLocaleString() + ' hrs';
    }

    /* FAQ ACCORDION */
    function toggleFaq(headerElement) {
      const item = headerElement.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!isOpen) {
        item.classList.add('open');
      }
    }

    /* MODAL HANDLERS */
    function openModal(preselectPlan = '') {
      document.getElementById('auditModal').style.display = 'flex';
      if(preselectPlan) {
        const select = document.getElementById('mService');
        if(preselectPlan.includes('Starter')) select.value = 'WA_Marketing';
        else if(preselectPlan.includes('Growth')) select.value = 'Both';
        else if(preselectPlan.includes('Enterprise')) select.value = 'Enterprise';
      }
    }

    function closeModal() {
      document.getElementById('auditModal').style.display = 'none';
      document.getElementById('modalSuccess').style.display = 'none';
      document.getElementById('modalAuditForm').style.display = 'block';
    }

    function handleModalSubmit(e) {
      e.preventDefault();
      document.getElementById('modalAuditForm').style.display = 'none';
      document.getElementById('modalSuccess').style.display = 'block';
    }

    function handleInlineSubmit(e) {
      e.preventDefault();
      document.getElementById('inlineAuditForm').style.display = 'none';
      document.getElementById('inlineSuccess').style.display = 'block';
    }

    function scrollToElement(selector) {
      const el = document.querySelector(selector);
      if(el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function toggleMobileNav() {
      const navLinks = document.querySelector('.nav-links');
      if(navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '78px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#0E1524';
        navLinks.style.padding = '20px';
        navLinks.style.borderBottom = '1px solid var(--border-subtle)';
      }
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
      switchSimFlow('b2b');
      updateCalculator();
    });